//Row is the return type of fetching a single row from the database.
//T resembles a database table with both relations and colloms modelled as attributes.
//Row will narrow down the type of T according to the query Q
//For examples see `types.spec.ts` and `playground.ts`

export type Row<T, Q extends Query> = 
    Where<Q['where'],              //`Where` narrows attribute types from `Select` according to the `where:` part
          Select<Q['select'], T>>  //`Select` picks the right attributes from `T` according to the `select:` part
    & Include<Q['include'], T>     //`Include` adds relations by recursively calling `Row` for each entry in the `include:` part

export type Query = {
    select: string,
    include: Readonly<Record<string, Query>>,
    where: Readonly<Record<string, any>>
}

export type AlwaysEmpty = {}

//Picks attributes from a row type
export type Select<K, T> =
    T extends (infer Q)[] ? 
        (K & keyof Q) extends never ? AlwaysEmpty //pick<T, never> is {} we want to return `AlwaysEmpty` in this case
        : Pick<Q, K & keyof Q>[]  //T is Q[] and K contains elements in keyof T
    : (K & keyof T) extends never ? 
        AlwaysEmpty
    : Pick<T, K & keyof T>      //T is not an array and K contains elements in keyof T

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

export type Include<I extends Record<string, Query>, T> = {
    [R in keyof I]:        
        R extends keyof T ? //Verify that the name of the relation in `include:` matches an attribute on `T`.
            Row<T[R], I[R]> //Recursivly invoke `Row` for each entry in `include:`. `T[R]` is the relation type on `T` and `I[R]` is the matching `Query`.
        : never //the relation name `R` doesn't match an attribute on T. This shouldn't happen in practice because `Q['include']` is constrained by Query types
}

