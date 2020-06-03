import * as T from './types'

//Select
(() => {
    type T = {
        id: number,
        name: string,
        createdAt: Date
    }

    //simple
    const op1: T.Select<['name'], T> = {name: '123'}
    //two fields
    const op2: T.Select<['name', 'id'], T> = {name: '123', id: 123}
    //arrays:
    const op3: T.Select<['name', 'id'], T[]> = [{name: 'foo', id: 123}]
    //undefined
    const op4: T.Select<undefined, []> = {}
    //empty
    const op5: T.Select<[], T> = {}
});

//Where
(() => {
    type T = {
        id: number
        name: string
    }
    let v1: T.Where<{id: 1}, T> = {id: 1, name: 'name'}
    //@ts-expect-error
    let v2: T.Where<{id: 1}, T> = {id: 2, name: 'name'} //id not in narrowed type
    //@ts-expect-error
    let v3: T.Where<{id: 1}, T> = {id: 1} //mising 'name'
    
    //Ignore unknown queries
    let v4: T.Where<{id: {imcomplex: 12}}, T> = {id: 1, name: 'foo'}

    //`IN` type queries
    let v5: T.Where<{id: {in: [1, 2]}}, T>
    v5 = {id: 1, name: 'f'}
    v5 = {id: 2, name: 'f'}
    //@ts-expect-error
    v5 = {id: 3, name: 'f'} //3 not in '1'|'2'

});

//Row
(() => {
    type T = {
        id: number,
        name: string,
        createdAt: Date
        project: {
            name: string
        }
    }

    //select: Row<T, {select: ['id']}> => {id: number}
    let r1: T.Row<T, {select: ['id']}> = {id: 1}                                       

    //include:
    // Row<T, {include: {project: {select: ['name']}}}> 
    // => {project: {name: 'string'}}
    let r3: T.Row<T, {include: {project: {select: ['name']}}}> = {project: {name: 'foo'}} 

    //Combined
    let r4: T.Row<T, {select: ['id'], include: {project: {select: ['name']}}}> 
        = {id: 123, project: {name: 'foo'}} 

    //select narrowing:
    let r5: T.Row<T, {select: ['id'], where: {id: 12}}> = {id: 12}
    r5 = {id: 12} //typeof name is string
    //@ts-expect-error
    r5 = {id: 13, name} //typeof id is 12    
})
