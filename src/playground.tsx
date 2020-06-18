import { Row, RelsDef, RelNames, RelInfo } from './types'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Table, RelSpec, defineDB } from './db'
import Knex = require('knex')
import _ = require('lodash')

export const omnifocusCfg = {
  client: 'sqlite3',
  connection: {
    filename: "/Users/kasperlanger/Library/Group Containers/34YW5XSRB7.com.omnigroup.OmniFocus/com.omnigroup.OmniFocus3/com.omnigroup.OmniFocusModel/OmniFocusDatabase.db"
  }
} as const

async function main() {
  const knex = Knex(omnifocusCfg)

  const db = defineDB<Schema>(knex)({
    Task: {
      belongsTo: {
        ProjectInfo: {name: 'project' as const, fk: 'containingProjectInfo', key: 'pk'}
      }
    },
    ProjectInfo: {
      belongsTo: {
        Task: {name: 'task' as const, fk: 'task', key: 'persistentIdentifier'}
      }
    }
    
  })
      
  const tasks = db('Task')
  const projects = db('ProjectInfo')
  
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

  // //Now let's fetch the required data. Note again that we don't need to mention the required columns directly
  const rows = await inInbox.where(notFinished).select(taskSelect).all()
  
  // //Now let's use the returned data. Note that the typechecker guarantees that the query matches the fields accessed
  console.log(renderToStaticMarkup(<TaskListView tasks={rows.slice(0,3)} />))

  const t = await tasks.select('name', 'inInbox')
                       .include('project', projects.select('effectiveStatus')
                                                   .include('task', tasks.select('name'))).first()

  console.info({name: t.name, projectTaskName: t.project?.task?.name})
  
  knex.destroy()
}

main()


type Schema = {
  ProjectInfo: ProjectInfo,
  Task: Task,
}

type ProjectInfo = {
  pk: string,
  effectiveStatus: string,
  task: string,
}

type Task = {
  persistentIdentifier: string,
  containingProjectInfo: string|null,
  projectInfo: string|null,
  name: string
  inInbox: boolean,
  dateCompleted: Date | null
}