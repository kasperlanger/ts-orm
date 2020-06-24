import { renderToStaticMarkup } from 'react-dom/server'
import { defineDB } from './db'
import Knex = require('knex') 
import _ = require('lodash')
import {ProjectInfo, Task, TaskToTag, Context} from './omnifocus/types'
import * as React from 'react'

export const omnifocusCfg:Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: "/Users/kasperlanger/Library/Group Containers/34YW5XSRB7.com.omnigroup.OmniFocus/com.omnigroup.OmniFocus3/com.omnigroup.OmniFocusModel/OmniFocusDatabase.db"
  }
}

type Schema = {
  ProjectInfo: ProjectInfo,
  Task: Task,
  TaskToTag: TaskToTag,
  Tag: Context
}

async function main() {
  const knex = Knex(omnifocusCfg)

  const db = defineDB<Schema>(knex)({})
  const tasks = db('Task')
  const projects = db('ProjectInfo')
  
  const inInbox = tasks.where({inInbox: true})
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

  const taskProject = tasks.belongsTo(projects).on('containingProjectInfo', '=', 'pk')
  const projectTasks = projects.hasMany(tasks).on('pk', '=', 'containingProjectInfo')
  const taskSiblings = tasks.hasMany(tasks).through(taskProject, projectTasks)
  
  const exampleProj = await projects.select('status', 'pk').where({pk: 'k9KsNhP0_AI'})
    .include({
      tasks: projectTasks(tasks.select('name', 'flagged')),
    })
    .first()
    
  console.info({tasks: exampleProj.tasks.map(t => `${t.name}${t.flagged ? '!' : ''}`).join()})

  const taskWithProj = await tasks.where({containingProjectInfo: 'k9KsNhP0_AI'})
                                  .select('name', 'containingProjectInfo')
                                  .include({project: taskProject(projects.select("status"))})
                                  .first()

                              
  console.info(JSON.stringify(taskWithProj))

  knex.destroy()
}

main()


