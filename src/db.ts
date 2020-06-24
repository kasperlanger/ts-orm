import {RelsDef, RelNames, RelInfo} from './types'
import {hasMany, belongsTo} from './relations'
import Knex = require('knex')
import _ = require('lodash')
import { exception } from 'console'

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

interface None {	
	_: never;
}

type Includes<ROW> = Record<string, (rows: ROW[]) => any[] | Promise<any[]>>

type IncludesReturn<I extends Includes<any>> = {
	[K in keyof I]: 
		I[K] extends (rows: []) => Promise<(infer Q)[]> ? Q 
		: I[K] extends (rows: []) => (infer Q)[] ?  Q
		: unknown
}

//TODO: Consider replacing with `InferRowType` everywhere and rename to something shorter
type RowType<ROW, COLS extends keyof ROW, INCLUDE> = 
	Pick<Required<ROW>, COLS> & INCLUDE

type AnyRow = Record<string,any>

type IncludeFns<I extends Record<string,any>> = {
	[K in keyof I]: (rows: AnyRow[]) => I[K]
}
export type InferRowType<SW extends SelectWhere> =
	SW extends SelectWhere<any, infer ROW, infer COLS, infer INCLUDE> ? RowType<ROW,COLS,INCLUDE> : 'InferRowType failed'

export class SelectWhere<NAME extends string = string, 
												 ROW extends Record<string, any> = any, 
												 COLS extends keyof ROW = any,
												 INCLUDE extends Record<string, any> = any
												 >{  

	//Fake fields that are always null. Used to conviniently extract return types of queries with `typeof`
	readonly single!: InferRowType<this>
	readonly many!: InferRowType<this>[]

	constructor(public table: Table<NAME, any>, 
				public cols: COLS[], 
				public preds: Partial<Record<keyof ROW, any>>,
				public includeFns: IncludeFns<INCLUDE>
				){}

	select<C extends keyof ROW>(s: C|SelectWhere<NAME,any,C,None>, ...rest: C[]) {
		const unwrapped = s instanceof SelectWhere ? s.cols : [s]
		const shallowClone = _.clone(this) as SelectWhere<NAME,ROW,COLS|C, INCLUDE>
		shallowClone.cols = [...this.cols, ...unwrapped, ...rest]
		return shallowClone
	}

	where<W1 extends Partial<ROW>>(w: W1|SelectWhere<NAME, any, never, None>) { 
		const shallowClone: SelectWhere<NAME,ROW,COLS,INCLUDE> = _.clone(this)//todo narrow type where possible
		let sw = w instanceof SelectWhere ? w.where : w
		shallowClone.preds = mergePreds(this.preds, sw)
		return shallowClone
	}

	include<I extends Includes<RowType<ROW,COLS,INCLUDE>>>(includeFns: I): SelectWhere<NAME, ROW, COLS, INCLUDE & IncludesReturn<I>> {
		const shallowClone = _.clone(this)
		shallowClone.includeFns = {...this.includeFns, ...includeFns} as any
		return shallowClone as any
	}
	
	async first(): Promise<RowType<ROW,COLS,INCLUDE>> {
		const all = await this.all(1) //TODO add limit
		return all[0]
	}

	async all(limit=-1): Promise<RowType<ROW,COLS,INCLUDE>[]> {
		let knexQuery = this.table.knexTable()
		if (limit > 0){
			knexQuery = knexQuery.limit(1)
		}
		_.forEach(this.preds, (predVal, predKey) => {
			if (Array.isArray(predVal)){
				knexQuery = knexQuery.whereIn(predKey, predVal)
			} else {
				knexQuery = knexQuery.where({[predKey]: predVal})
			}
		})

		let res = await knexQuery.select(this.cols)
		
		const includeRes = _.map(this.includeFns, async (fn, key) => {
			const incl = await fn(res)
			if (incl.length !== res.length){ throw new Error(`Error in include fn: length mismatch ${incl.length} != ${res.length}`)}
			_.each(res, (row, i) => row[key] = incl[i])
			return incl //return value only used for debugging
		})
		await Promise.all(includeRes) //We need to wait for all include functions to return and mutate results
		return res
	}
}

export function defineDB<S extends Record<string,Record<string, any>>>(knex: Knex){
	return function<RD extends RelsDef<S>>(rels: RD){
		
		return function <N extends string & keyof S>(name: N){
			
			//`(RelsSpec<RD>)[N]` is possible `unknown` so we add `& {}` so `InferInclude` doesn't fail
			return new Table<N, S[N]>(name, knex)
		}
	}
}

type InferRow<T extends Table<any,any>> =
	T extends Table<any, infer Q> ? Q : 'inferRow failed'

export class Table<NAME extends string, ROW extends Record<string,any>> {
	readonly name: NAME
	readonly knex: Knex
	
	constructor(name: NAME, knex: Knex){
		this.name = name
		this.knex = knex
	}

	knexTable() {
		return this.knex.table(this.name)
	}

	select<S extends keyof ROW>(...s: S[]): SelectWhere<NAME,ROW,S,None> {
		return new SelectWhere<NAME,ROW,S,None>(this, s, {}, {})
	}

	where<W extends Partial<ROW>>(w: W): SelectWhere<NAME,ROW,never, None> {
		return new SelectWhere<NAME,ROW,never,None>(this, [], w, {})
	}

	belongsTo<TO extends Table<any, any>>(to: TO){
		const from:Table<NAME,ROW> = this
		return {
			on: function<KEY extends string & keyof InferRow<TO>, FK extends string & keyof ROW>(fk: FK, cmp: '=', key: KEY){
				return belongsTo({fk, key})
			}
		}
	}

	hasMany<TO extends Table<any,any>>(to: TO){
		const from:Table<NAME,ROW> = this
		return {
			// reverseOf: function<FK extends string, KEY extends string>({fk,key}: {type: 'belongsTo', to: Table<NAME,any>, key: KEY, fk: FK}){
			// 	return hasMany({fk, key})
			// },
			on: function<FK extends string & keyof InferRow<TO>, KEY extends string & keyof ROW>(key: KEY, cmp: '=', fk: FK){
				return hasMany({fk, key})
			},
			through: function(through: {}, rel: {}){
				return {through, rel}
			}
		}
	}
}

