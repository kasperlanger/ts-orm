import {Row} from './types'
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

