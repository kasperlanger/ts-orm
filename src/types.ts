export type Query = {
    select?: Readonly<string[]>,
    include?: Readonly<Record<string, Query|undefined>>,
    where?: Readonly<Record<string, any>>
}

//Picks attributes from a row type like `Pick` but also handles arrays and undefined
export type Select<K extends (Readonly<string[]>|undefined), T> =
        K extends Readonly<string[]> ?
            T extends (infer Q)[] ? 
                Pick<Q, K[number] & keyof Q>[]  //T is Q[]
            : Pick<T, K[number] & keyof T>      //T is not an array
        : {}                                    //K is undefined

//Narrows row type given a where clause
export type Where<W, T> = T & {
    [K in (keyof W) & (keyof T)]: //traverse keys of W. `& (keyof T)` is to convince the typescheker that we can use `T[K]` bellow
        W[K] extends string ? W[K] :
        W[K] extends boolean ? W[K] :
        W[K] extends number ? W[K] :
        W[K] extends {in: Readonly<(infer Q)[]>} ? Q :
        W[K] extends Readonly<(infer Q)[]> ? Q :
        T[K]
}

export type Include<I, T> = {
    [R in keyof I]:        
        R extends keyof T ? //Verify that the name of the relation in `include:` matches an attribute on `T`.
            Row<T[R], I[R]> //Recursivly invoke `Row` for each entry in `include:`. `T[R]` is the relation type on `T` and `I[R]` is the matching `Query`.
        : never //the relation name `R` doesn't match an attribute on T. This shouldn't happen in practice because `Q['include']` is constrained by Query types
}

export type Row<T, Q extends Query> = 
    Where<Q['where'],              //`Where` narrows attribute types from `Select` according to the `where:` part
          Select<Q['select'], T>>  //`Select` picks the right attributes from `T` according to the `select:` part
    & Include<Q['include'], T>     //`Include` adds relations by recursively calling `Row` for each entry in the `include:` part