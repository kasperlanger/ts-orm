import {Query, Row, RelsDef} from './types'
import Knex = require('knex')
import _ = require('lodash')

class Predicate {

}

function mergePreds<W1, W2>(w1:W1, w2:W2): W1&W2{
    return _.merge(w1,w2)
}

export type RelSpec = {
    type: 'belongsTo' | 'hasMany',
    fk: string,
    key: string,
    table: string
} 

const relNames:RelNames<typeof rels, 'ProjectInfo', 'hasMany'> = 'tasks'
const info:RelInfo<typeof rels, 'ProjectInfo', 'tasks'> = {relType: 'hasMany', table: 'Task', fk: 'containingProjectInfo', key: 'pk', name: 'tasks'}


export function relsDef<S extends Record<string, {}>>() {
    return function<R extends RelsDef<S>>(rd: R): R{
        return rd
    }
}
  
type TableSpec = {
    row: Record<string, any>,
    rels: Record<string, RelSpec>
}

type RowType<TS extends TableSpec, C extends keyof TS['row'], I extends {}> =
    Pick<TS['row'], C> & I //TODO handle row is empty (i.e. `never`) 
    
type InferInclude<K extends string|number|symbol, SW> = 
    SW extends SelectWhere<any, infer TS, infer C, infer I> ? 
        {
            [K1 in K]?: RowType<TS, C, I>
        }
    : 'InferInclude Fail' 


class SelectWhere<N extends string,                         //name of table to ensure things line up when including and merging two queries
                  TS extends TableSpec,                     //types needed to infer return type and includes
                  C extends keyof TS['row'],                //Columns to include in return type
                  I extends {}>                             //Type of included associations
                  {  

    //TODO consider merging the stuff that doesn't change i.e name, rels, etc to on field so there's less stuff to pass on
    readonly table: Table<N, TS['row'], TS['rels']>
    readonly rels: Record<keyof I, SelectWhere<any, any, any, any>> 

    //consider mergin the stuff that does change to a single attribute as well
    readonly cols: C[]
    readonly preds: Record<keyof TS['row'], any> 

    readonly single!: RowType<TS, C, I>
    readonly many!: RowType<TS, C, I>[]

    
    constructor(table: Table<N, TS['row'], TS['rels']>, cols: C[], preds: Record<keyof TS['row'], Predicate>, rels: Record<keyof I, SelectWhere<any, any, any, any>>){
        this.table = table
        this.cols = cols
        this.preds = preds
        this.rels = rels
    }

    select<C1 extends keyof TS['row']>(s: C1|SelectWhere<N,TS, C1, any>, ...rest: C1[]): SelectWhere<N,TS,C|C1,I> {
        const cols = s instanceof SelectWhere ? [...this.cols, ...s.cols] : [...this.cols, s, ...rest]
        return new SelectWhere<N,TS,C|C1,I>(this.table, cols, this.preds, this.rels) 
    }

    where<W1 extends Partial<TS['row']>>(w: W1|SelectWhere<N,TS,never,any>): SelectWhere<N,TS,C,I> { //todo narrow type where possible
        let sw = w instanceof SelectWhere ? w.where : w
        const preds = mergePreds(this.preds, sw)
        return new SelectWhere<N,TS,C,I>(this.table, this.cols, preds, this.rels)
    }

    include<K extends keyof TS['rels'], 
            S extends SelectWhere<TS['rels'][K]['table'],any,any,any>>
        (rel: K, s: S): SelectWhere<N,TS,C, I & InferInclude<K,S>> {
            return new SelectWhere<N,TS,C,I & InferInclude<K,S>>(this.table, this.cols, this.preds, {...this.rels, [rel]: s} as any)
        }
    
    async first(): Promise<RowType<TS, C, I>> {
        const all = await this.all() //TODO add limit
        return all[0]
    }

    async all(): Promise<RowType<TS, C, I>[]> {
        const knexTable = this.table.knexTable()
        const selectFks = Object.values(this.table.relDefs).map((x) => x.fk)
        const rows = await knexTable.where(this.preds).select(...selectFks, ...(this.cols as string[]))
        for (let rel in this.rels){
            for (let row of rows){
                let relDef = this.table.relDefs[rel]
                //TOOD remove
                row[rel] = await this.rels[rel].where({[relDef.key]: row[relDef.fk]}).first()
            }
        }
        return rows
    }
}

export function table<T extends {}>(knex: Knex){
    return function<N extends string, R extends Record<string, RelSpec>>(name: N, rels: R){
        return new Table<N, T, R>(name, knex, rels)
    }
}

export class Table<N extends string, T extends {}, R extends Record<string, RelSpec>> {
    readonly name: N
    readonly relDefs: R
    readonly knex: Knex
    
    constructor(name: N, knex: Knex, rels: R){
        this.name = name
        this.knex = knex
        this.relDefs = rels
    }

    knexTable() {
        return this.knex.table(this.name)
    }

    select<S extends keyof T>(...s: S[]): SelectWhere<N,{row:T, rels: R}, S, {}>{
        return new SelectWhere<N,{row:T, rels: R},S, {}>(this, s, {} as any, {} as any)
    }

    where<W extends Partial<T>>(w: W): SelectWhere<N,{row:T, rels: R}, never, {}>{
        return new SelectWhere<N,{row:T, rels: R},never, {}>(this, [], {} as any, {} as any)
    }
}

