import { omniFocus } from './knex';
import { expect } from 'chai';
import 'mocha';

after(() => omniFocus.destroy())

describe('knex', () => {
    it('It returns count of tasks', async () => {
        const res = await omniFocus.table("Task").count()
        expect(res[0]['count(*)']).to.be.above(100)
    })

    it('playground', async ()  => {
        const f = await omniFocus.table("Task").select('name', 'persistentIdentifier').first() 
        console.info(f)
    })

    it('It can find a name of a task', async () => {
        const res = await omniFocus.table("Task").select('name')
        expect(res[0]['name']).to.not.be.empty
    })
});

