import {Query, Row} from './types'
import Knex = require('knex')

export class Table<T,Q extends Query> {
    name: string
    knex: Knex
    constructor(name: string, cfg: Knex.Config){
        this.name = name
        this.knex = Knex(cfg)
    }

    first<Q2 extends Q>(q:Q2): Promise<Row<T, Q2>> {
        const s = this.knex.table(this.name).select(q.select ?? '*')
        if (q.where){
            return s.where(q.where).first()
        } else {
            return s.first()
        }

    }
}

