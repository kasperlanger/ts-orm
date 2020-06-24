import * as _ from 'lodash'
import {SelectWhere, InferRowType} from './db'

type Rows = Array<Record<string, any>>

export function hasMany<FK extends string,KEY extends string>
  ({fk, key}: {fk: FK, key: KEY}){
    return function<L extends SelectWhere>(loader: L){
      return async function<R extends {[Q in KEY]:any}>(rows: R[]){
          const keys = _.map(rows, rows => rows[key])
          const relRows:InferRowType<L>[] = await loader.select(fk).where({[fk]: keys}).all() as any
          const relsByFk = _.groupBy(relRows, fk)
          return rows.map(row => relsByFk[row[key]] || [])        
      }
    }
}

export function belongsTo<FK extends string,KEY extends string>
  ({fk, key}: {fk: FK, key: KEY}){
    return function<L extends SelectWhere>(loader: L){
      return async function<R extends {[Q in FK]:any}>(rows: R[]){
          const fKeys = _.map(rows, rows => rows[fk])
          const relRows:InferRowType<L>[] = await loader.select(key).where({[key]: fKeys}).all() as any
          const relsByKey = _.keyBy(relRows, key)
          return rows.map(row => relsByKey[row[fk]] || [])        
      }
    }
}