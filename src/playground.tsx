import { Row, RelsDef, RelNames, RelInfo } from './types'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Table, RelSpec, relsDef, table } from './db'
import Knex = require('knex')

export const omnifocusCfg = {
  client: 'sqlite3',
  connection: {
    filename: "/Users/kasperlanger/Library/Group Containers/34YW5XSRB7.com.omnigroup.OmniFocus/com.omnigroup.OmniFocus3/com.omnigroup.OmniFocusModel/OmniFocusDatabase.db"
  }
} as const


function  id<T extends string>(s:T): T {
  return s
}


async function main() {
  const knex = Knex(omnifocusCfg)
  const tasks = table<Task>(knex)('Task', {})
  const projects = table<ProjectInfo>(knex)('ProjectInfo', {})

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


  //Define relations
  const rels = relsDef<Schema>()({
    ProjectInfo: {
      belongsTo: {
        Task: {name: id('task'), fk: 'pk', key: 'persistentIdentifier'} 
      }, 
      hasMany: {
        Task: {name: id('tasks'), fk: 'containingProjectInfo', key: 'pk'},
      }
    }, 
    Task: {
      belongsTo: {
        ProjectInfo: {name: id('project'), fk: 'containingProjectInfo', key: 'pk'},
      }
    }
  })

  //TODO automate this
    const rd = rels.Task.belongsTo.ProjectInfo
    const taskRels = {
      [rd.name]:{
        type: 'belongsTo',
        fk: rd.fk,
        key: rd.key,
        table: 'ProjectInfo'
      } as const
    }
    const tasks2 = table<Task>(knex)('Task', taskRels)
  
    const t = await tasks2.select('name')
                          .include('project', projects.select('effectiveStatus')).first()
  
    console.info({name: t.name, projectStatus: t.project?.effectiveStatus})
  
  knex.destroy()
}

main()


type Schema = {
  ProjectInfo: ProjectInfo,
  Task: Task,
  Foo: {
    id: string
  }
}


type ProjectInfo = {
  pk: string,
  effectiveStatus: string,
  task: string,
}

type ProjectInfoRels = {
  task: Task,
  tasks: Task[],
}

type ProjectInfoQuery = Readonly<{
  select: 'pk'|'task'|'effectiveState',
  include: {
  }, where: {
    task: TaskQuery,
    tasks: TaskQuery,
    pk?: string,
    effectiveState?: 'dropped'|'active'|'done'
  }
}>

type Task = {
  persistentIdentifier: string,
  containingProjectInfo: string|null,
  projectInfo: string|null,
  name: string
  inInbox: boolean,
  dateCompleted: Date | null
}

type TaskQuery = Readonly<{
  select: 'name' | 'inInbox' | 'dateCompleted' | 'persistentIdentifier' | 'containingProjectInfo',
  include: {}
  where: Readonly<{
    persistentIdentifier?: string,
    name?: string,
    inInbox?: boolean,
    dateCompleted?: Date | null
  }>
}>