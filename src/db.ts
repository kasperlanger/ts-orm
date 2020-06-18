import {RelsDef, RelNames, RelInfo} from './types'
import Knex = require('knex')
import _ = require('lodash')

function mergePreds<W1, W2>(w1:W1, w2:W2): W1&W2{
	return _.merge(w1,w2)
}

export type RelSpec = {
	type: 'belongsTo' | 'hasMany',
	fk: string,
	key: string,
	table: string
} 

type RelsSpec<RD extends RelsDef<any>> = {
	[P in keyof RD]: {
		[N in RelNames<RD, P>]: RelInfo<RD, P, N>
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
	: 'InferInclude fail'


class SelectWhere<N extends string,                         //name of table to ensure things line up when including and merging two queries
				  TS extends TableSpec,                     //types needed to infer return type and includes
				  C extends keyof TS['row'],                //Columns to include in return type
				  I extends {}>                             //Type of included associations
				 {  

	//Fake fields that are always null. Used to conviniently extract return types of queries with `typeof`
	readonly single!: RowType<TS, C, I>
	readonly many!: RowType<TS, C, I>[]

	constructor(public table: Table<N, TS['row'], TS['rels']>, 
				public cols: C[], 
				public preds: Record<keyof TS['row'], any>, 
				public rels: Record<keyof I, SelectWhere<any, any, any, any>>){
	}

	select<C1 extends keyof TS['row']>(s: C1|SelectWhere<N,TS,C1,any>, ...rest: C1[]) {
		const unwrapped = s instanceof SelectWhere ? s.cols : [s]
		const shallowClone: SelectWhere<N,TS,C|C1,I> = _.clone(this)
		shallowClone.cols = [...this.cols, ...unwrapped, ...rest]
		return shallowClone
	}

	where<W1 extends Partial<TS['row']>>(w: W1|SelectWhere<N,TS,never,any>) { 
		const shallowClone: SelectWhere<N,TS,C,I> = _.clone(this)//todo narrow type where possible
		let sw = w instanceof SelectWhere ? w.where : w
		shallowClone.preds = mergePreds(this.preds, sw)
		return shallowClone
	}

	include<K extends keyof TS['rels'], 
			S extends SelectWhere<TS['rels'][K]['table'],any,any,any>>
		(rel: K, s: S) {
			return new SelectWhere<N,TS,C,I & InferInclude<K,S>>(this.table, this.cols, this.preds, {...this.rels, [rel]: s} as any)
		}
	
	async first(): Promise<RowType<TS, C, I>> {
		const all = await this.all() //TODO add limit
		return all[0]
	}

	async all(): Promise<RowType<TS, C, I>[]> {
		const knexTable = this.table.knexTable()
		const selectFks = Object.values(this.table.relDefs).map((x) => x.fk)
		//TODO no need to load selectFks when we're not loading the relation
		const rows = await knexTable.where(this.preds).select(...selectFks, ...(this.cols as string[]))
		for (let rel in this.rels){
			for (let row of rows){
				let relDef = this.table.relDefs[rel]
				//TODO remove n+1
				row[rel] = await this.rels[rel].where({[relDef.key]: row[relDef.fk]}).first()
			}
		}
		return rows
	}
}

export function defineDB<S extends Record<string,Record<string, any>>>(knex: Knex){
	return function<RD extends RelsDef<S>>(rels: RD){
		
		return function <N extends string & keyof S>(name: N){

			const flatRels: (RelSpec & {name: string})[] =
				_.flatMap(rels[name]?.belongsTo, (v, child) => {
					return  v ? {type: 'belongsTo', fk: v.fk, key: v.key ?? '??', table: child, name: v.name} : []
				})
			
			const relMap = {} as Record<string, RelSpec>
			flatRels.forEach(rd => relMap[rd.name] = rd)
			
			//`(RelsSpec<RD>)[N]` is possible `unknown` so we add `& {}` so `InferInclude` doesn't fail
			return new Table<N, S[N], (RelsSpec<RD>)[N] & {}>(name, knex, relMap)
		}
	}
}

export class Table<N extends string, T extends {}, R extends Record<string, any>> {
	readonly name: N
	readonly relDefs: Record<string, any>
	readonly knex: Knex
	
	constructor(name: N, knex: Knex, rels: Record<string, any>){
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

