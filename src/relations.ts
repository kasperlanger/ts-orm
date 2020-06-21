import * as _ from 'lodash'
import {SelectWhere} from './db'

type Rows = Array<Record<string, any>>

export function loadHasMany({fk, key}: {fk: string, key: string}, target: string, loader: SelectWhere<any,any,any,any> ){
  return async function(rows: Rows|Promise<Rows>){
    const clonedRows: Rows = _.clone(await rows)
    clonedRows.forEach(r => r[target] = [])
    const rowsByKey = _.keyBy(clonedRows, key)
    const keys = _.keys(rowsByKey)
    const relRows:Rows = await loader.select(fk).where({[fk]: keys}).all()
    relRows.forEach(rel => {
      rowsByKey[rel[fk]][target].push(rel)
    })
    return clonedRows
  }
}