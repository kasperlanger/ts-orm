type Query = {
    select?: Readonly<string[]>,
    include?: Readonly<Record<string, Query|undefined>>,
    where?: Readonly<Record<string, any>>
}

type Project = {
    name: string
    createdAt: Date,
    tasks: Task[]
}

type ProjectQuery = Readonly<{
    select?: Readonly<('name'|'createdAt')[]>,
    include?: Readonly<{
        tasks: TaskQuery
    }>
}>

type Task = {
    id: string,
    name: string
    inInbox: boolean,
    createdAt: Date,
    project: Project
}

type TaskQuery = Readonly<{
    select?: Readonly<('id'|'name'|'inInbox'|'createdAt')[]>,
    include?: Readonly<{
        project?: ProjectQuery
    }>, 
    where?: Readonly<{
        id?: string | Readonly<string []>,
        inInbox?: boolean
    }>
}>

//Picks attributes from a row type like `Pick` but also handles arrays and undefined
type Select<K extends (Readonly<string[]>|undefined), T> =
        K extends Readonly<string[]> ?
            T extends (infer Q)[] ? 
                Pick<Q, K[number] & keyof Q>[]  //T is Q[]
            : Pick<T, K[number] & keyof T>      //T is not an array
        : {}                                    //K is undefined

(() => {
    type T = {
        id: number,
        name: string,
        createdAt: Date
    }

    //simple
    const op1: Select<['name'], T> = {name: '123'}
    //two fields
    const op2: Select<['name', 'id'], T> = {name: '123', id: 123}
    //arrays:
    const op3: Select<['name', 'id'], T[]> = [{name: 'foo', id: 123}]
    //undefined
    const op4: Select<undefined, []> = {}
    //empty
    const op5: Select<[], T> = {}
});

//Narrows row type given a where clause
type Where<W, T> = T & {
    [K in (keyof W) & (keyof T)]: //only traverse so we can default to `T[K]` i.e. the type on T
        W[K] extends string ? W[K] :
        W[K] extends boolean ? W[K] :
        W[K] extends number ? W[K] :
        W[K] extends {in: Readonly<(infer Q)[]>} ? Q :
        W[K] extends Readonly<(infer Q)[]> ? Q :
        T[K]
}

(() => {
    type T = {
        id: number
        name: string
    }
    let v1: Where<{id: 1}, T> = {id: 1, name: 'name'}
    //@ts-expect-error
    let v2: Where<{id: 1}, T> = {id: 2, name: 'name'} //id not in narrowed type
    //@ts-expect-error
    let v3: Where<{id: 1}, T> = {id: 1} //mising 'name'
    
    //Ignore unknown queries
    let v4: Where<{id: {imcomplex: 12}}, T> = {id: 1, name: 'foo'}

    //`IN` type queries
    let v5: Where<{id: {in: [1, 2]}}, T>
    v5 = {id: 1, name: 'f'}
    v5 = {id: 2, name: 'f'}
    //@ts-expect-error
    v5 = {id: 3, name: 'f'} //3 not in '1'|'2'

})

type Include<I, T> = {
    [R in keyof I]:        
        R extends keyof T ? //Verify that the name of the relation in `include:` matches an attribute on `T`.
            Row<T[R], I[R]> //Recursivly invoke `Row` for each entry in `include:`. `T[R]` is the relation type on `T` and `I[R]` is the matching `Query`.
        : never //the relation name `R` doesn't match an attribute on T. This shouldn't happen in practice because `Q['include']` is constrained by Query types
}

type Row<T, Q extends Query> = 
    Where<Q['where'],              //`Where` narrows attribute types from `Select` according to the `where:` part
          Select<Q['select'], T>>  //`Select` picks the right attributes from `T` according to the `select:` part
    & Include<Q['include'], T>     //`Include` adds relations by recursively calling `Row` for each entry in the `include:` part

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
    let r1: Row<T, {select: ['id']}> = {id: 1}                                       

    //include:
    // Row<T, {include: {project: {select: ['name']}}}> 
    // => {project: {name: 'string'}}
    let r3: Row<T, {include: {project: {select: ['name']}}}> = {project: {name: 'foo'}} 

    //Combined
    let r4: Row<T, {select: ['id'], include: {project: {select: ['name']}}}> 
        = {id: 123, project: {name: 'foo'}} 

    //select narrowing:
    let r5: Row<T, {select: ['id'], where: {id: 12}}> = {id: 12}
    r5 = {id: 12} //typeof name is string
    //@ts-expect-error
    r5 = {id: 13, name} //typeof id is 12    
})


declare function getTask<Q extends TaskQuery>(query: Q): Row<Task, Q>

(() => {
    let v1 = getTask({select: ['id']})
    const a1:string = v1.id
    v1 = { id: '123' }
    //@ts-expect-error
    v1.name //name not in select

    let v2 = getTask({select: ['id', 'name']})
    const a2:string = v2.name
    v2 = { id: '123', name: '123'}

    let v3 = getTask({include: {project: {select: ['name']}}})
    const a3: string = v3.project.name
    //@ts-expect-error
    v3.project.createdAt //not in nested select    

    //double nested and `tasks` is a collection
    let v4 = getTask({include: {project: {include: {tasks: {select: ['name']}}}}})
    const a4: string = v4.project.tasks[0].name
    v4.project.tasks[0].name

    function v<S extends string|number|Date>(v: S): S {
        return v
    }
    
    //where narrowing 
    const v5 = getTask({select: ['inInbox'], where: {inInbox: true})
    const a5: true = v5.inInbox
    
    // Since typeof id is string | string[] the typechecker is more aggressive on wideing values 
    // than it's the case with the `inInbox: true` example above
    // Either add `as const` around the query or wrap indvidual values in `v(...)`
    const v6 = getTask({select: ['id'], where: {id: v('2')}}) 
    const a6:'2' = v6.id

    const v7 = getTask({select: ['id'], where: {id: [v('4'), v('5')]}}) 
    const a7:'4'|'5' = v7.id

    const v8 = getTask({select: ['id'], where: {id: ['7', '8']}} as const) 
    const a8:'7'|'8' = v8.id

    let v9 = getTask({select: ['id'], where: {id: '1'}})
    v9 = {id: '2'} //typeof `id` is string because we didn't add `as const` or use `v(...)`
    

})
