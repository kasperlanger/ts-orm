import {Row} from './types'
import {Table} from './db'
import Knex = require('knex')

export const omnifocusCfg = {
    client: 'sqlite3', 
    connection: {
        filename: "/Users/kasperlanger/Library/Group Containers/34YW5XSRB7.com.omnigroup.OmniFocus/com.omnigroup.OmniFocus3/com.omnigroup.OmniFocusModel/OmniFocusDatabase.db"
    }
} as const


//https://github.com/zenspider/bin/blob/8e611288e2c54af390f59e228a01bb1af7bd61e8/of_common.rb

async function main(){
    const knex = Knex(omnifocusCfg)
    const tasks = new Table<Task, TaskQuery>('Task', knex)
    const inInbox = tasks.where({inInbox: true})
    const notFinished = tasks.where({dateCompleted: null})

    //Let's create a function that takes a task (with two required fields) and renders a markdown link.
    //Note that access to attributes on the task object is fully typechecked
    const linkView = tasks.select('persistentIdentifier', 'name')
                          .fn((task) => `[${task.name}](omnifocus:///task/${task.persistentIdentifier})`)

    //Now we'll create a a function that takes a list of tasks and turns each task into a link
    //Note that the function doesn't explicitly mention the required fields but still the code is fully typechecked
    const taskListView = tasks.select(linkView.requiredColumns)
                              .listFn((tasks) => tasks.map(linkView).join('\n'))

  
    //Now let's fetch the required data. Note again that we don't need to mention the required columns directly
    const rows = await inInbox.and(notFinished).select(taskListView.requiredColumns).all()
    
    //Now let's use the returned data. Note that the typechecker guarantees that the query matches the fields accessed
    console.log(taskListView(rows))        

    knex.destroy()
}

main()


type Project = {
    name: string
    persistentIdentifier: string
    tasks: Task[]
}

type ProjectQuery = Readonly<{
    select?: 'name'|'persistentIdentifier',
    include?: Readonly<{
        tasks: TaskQuery
    }>
}>

type Task = {
    persistentIdentifier: string,
    name: string
    inInbox: boolean,
    project: Project,
    dateCompleted: Date
}

type TaskQuery = Readonly<{
    select: ('id'|'name'|'inInbox'|'dateCompleted'|'persistentIdentifier'),
    include: {}
    where: Readonly<{
        persistentIdentifier?: string,
        inInbox?: boolean,
        dateCompleted?: Date | null
    }>
}>