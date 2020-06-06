import { Row } from './types'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Table } from './db'
import Knex = require('knex')

export const omnifocusCfg = {
  client: 'sqlite3',
  connection: {
    filename: "/Users/kasperlanger/Library/Group Containers/34YW5XSRB7.com.omnigroup.OmniFocus/com.omnigroup.OmniFocus3/com.omnigroup.OmniFocusModel/OmniFocusDatabase.db"
  }
} as const


//https://github.com/zenspider/bin/blob/8e611288e2c54af390f59e228a01bb1af7bd61e8/of_common.rb
declare function fn(a: any, fn: any): any

async function main() {
  const knex = Knex(omnifocusCfg)
  const tasks = new Table<Task, TaskQuery>('Task', knex)

  const inInbox = tasks.where({ inInbox: true })
  const notFinished = tasks.where({ dateCompleted: null })

  const taskSelect = tasks.select('name', 'persistentIdentifier', 'inInbox')
  const TaskView = ({task}: {task: typeof taskSelect.single}) => (
      <li>
        <a href={`omnifocus:///task/${task.persistentIdentifier}`}>
          {task.inInbox ? '📥' : null}
          {task.name}
        </a>
      </li>)

  //Note that TaskListView doesn't refer directly to the required columns on each task but is still fully typechecked
  const TaskListView = ({tasks}: {tasks: typeof taskSelect.many}) => (
    <ul>{tasks.map(t => <TaskView key={t.persistentIdentifier} task={t} />)}</ul>
  )

  //Now let's fetch the required data. Note again that we don't need to mention the required columns directly
  const rows = await inInbox.and(notFinished).select(taskSelect).all()

  //Now let's use the returned data. Note that the typechecker guarantees that the query matches the fields accessed
  console.log(renderToStaticMarkup(<TaskListView tasks={rows.slice(0, 3)} />))

  knex.destroy()
}

main()


type Project = {
  name: string
  persistentIdentifier: string
  tasks: Task[]
}

type ProjectQuery = Readonly<{
  select?: 'name' | 'persistentIdentifier',
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
  select: ('name' | 'inInbox' | 'dateCompleted' | 'persistentIdentifier'),
  include: {}
  where: Readonly<{
    persistentIdentifier?: string,
    inInbox?: boolean,
    dateCompleted?: Date | null
  }>
}>