import * as T from './types'

//Select
(() => {
    type T = {
        id: number,
        name: string,
        createdAt: Date
    }

    //simple
    const op1: T.Select<'name', T> = {name: '123'}
    //two fields
    const op2: T.Select<'name'| 'id', T> = {name: '123', id: 123}
    //arrays:
    const op3: T.Select<'name'|'id', T[]> = [{name: 'foo', id: 123}]
    const op4: T.Select<string, T> = {id: 1, name: 'foo', createdAt: new Date()}
    //empty
    const op5: T.Select<never, T> = {} as T.AlwaysEmpty
    //ignore non existing keys
    const op6: T.Select<'non-existing-key'|'name', T> = {name: '1'} 
    //Non existing keys leads to empty
    const op7: T.Select<'non-existing-key', T> = {} as T.AlwaysEmpty
    //undefined
    const op8: T.Select<undefined, T> = {} as T.AlwaysEmpty
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

    let r1: T.Row<T, {select: 'id', where: {}, include: {}}> = {id: 1}                                       

    let r3: T.Row<T, {select: never, 
                      where: {}, 
                      include: {project: {select: 'name', where: {}, include: {}}}}> = 
            {project: {name: 'foo'}} 

    //select narrowing:
    let r5: T.Row<T, {select: 'id'|'name', where: {id: 12}, include: {}}> = {id: 12, name: 'foo'}
    const a5: 12 = r5.id
})
