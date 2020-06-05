import {Query, Row} from './types'
import Knex = require('knex')
import _ = require('lodash')
import { exception } from 'console'

class Where<T,Q extends Query, W extends Q['where']> {
    readonly table: Table<T,Q>
    readonly pred: W

    constructor(table: Table<T,Q>, where: W){
        this.table = table
        this.pred = where
    }

    select<S extends Q['select']>(...s: (S|Select<T,Q,S>)[]): SelectWhere<T,Q,S,W>{  
        return new SelectWhere<T,Q,S,W>({select: new Select(this.table, []).andSelect(...s), where: this})
    }

    and<W1 extends Q['where']>(w: W1|Where<T,Q,W1>): Where<T,Q,W&W1> {
        if (w instanceof Where){
            return new Where(this.table, _.merge(this.pred, w.pred))
        } else {
            return new Where(this.table, _.merge(this.pred, w))
        }
    }

    first(){
        return this.select().first()
    }
}

class Select<T,Q extends Query, S extends Q['select']> {
    readonly table: Table<T,Q>
    readonly cols: S[]

    constructor(table: Table<T,Q>, select: S[]){
        this.table = table
        this.cols = select
    }

    where<W extends Q['where']>(w: W){
        return new SelectWhere<T,Q,S,W>({select: this, where: new Where(this.table, w)}) 
    }

    andSelect<S1 extends Q['select']>(...s: (S1|Select<T,Q,S1>)[]): Select<T, Q, S|S1>{
        const values = _.flatMap(s, (v) => (
            v instanceof Select ? v.cols : [v]
        ))
        return new Select(this.table, [...this.cols, ...values])
    }

    fn<RT, 
       R extends Row<T, {select: S, where: {}, include: {}}>, 
       F extends (r:R) => RT> 
        (fn: F): F & {requiredColumns: Select<T,Q,S>, row: R, rows: R[]}{
            return Object.assign(fn, {requiredColumns: this, row: {} as R, rows: {} as R[] })
    }

    listFn<RT, 
            R extends Row<T, {select: S, where: {}, include: {}}>, 
            F extends (r:R[]) => RT> 
            (fn: F): F & {requiredColumns: Select<T,Q,S>, row: R, rows: R[]}{
                return Object.assign(fn, {requiredColumns: this, row: {} as R, rows: {} as R[] })
    }


    first(){
        return this.where({}).first()
    }
}

class SelectWhere<T,Q extends Query, S extends Q['select'], W extends Q['where']> {
    readonly where: Where<T,Q,W>
    readonly select: Select<T,Q,S>
    constructor({where, select}: {where: Where<T,Q,W>, select: Select<T,Q,S>}){
        [this.where, this.select] = [where, select]
    }

    and<W1 extends Q['where']>(where: W1|Where<T,Q,W1>) : SelectWhere<T,Q,S,W&W1>  {
        return new SelectWhere({where: this.where.and(where), select: this.select})
    }

    andSelect<S1 extends Q['select']>(...select: (S1|Select<T,Q,S1>)[]) : SelectWhere<T,Q,S|S1,W>{
        return new SelectWhere({where: this.where, select: this.select.andSelect(...select)}) 
    }

    merge<S1 extends Q['select'], W1 extends Q['where']>(q: SelectWhere<T,Q,S1,W1>){
        return this.and(q.where).andSelect(q.select)
    }

    async first(): Promise<Row<T, {select: S, where: W, include: {}}>> {
        const table = this.where.table
        const knexTable = table.knex.table(table.name)
        const where = this.where.pred
        const res = await knexTable.where(this.where.pred as {}).first(...this.select.cols)
        return res
    }

    async all(): Promise<Row<T, {select: S, where: W, include: {}}>[]> {
        const table = this.where.table
        const knexTable = table.knex.table(table.name)
        const where = this.where.pred
        const res = await knexTable.where(this.where.pred as {}).select(...this.select.cols)
        return res
    }
}

export class Table<T,Q extends Query> {
    readonly name: string
    readonly knex: Knex
    
    constructor(name: string, knex: Knex){
        this.name = name
        this.knex = knex
    }

    where<W extends Q['where']>(w: W): Where<T,Q,W>{
        return new Where(this, w)
    }

    select<S extends Q['select']>(...s: (S|Select<T,Q,S>)[]): Select<T,Q,S>{
        return new Select(this, []).andSelect(...s)
    }
}

