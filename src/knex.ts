import * as Knex from 'knex';

export const omnifocusCfg = {
    client: 'sqlite3', 
    connection: {
        filename: "/Users/kasperlanger/Library/Group Containers/34YW5XSRB7.com.omnigroup.OmniFocus/com.omnigroup.OmniFocus3/com.omnigroup.OmniFocusModel/OmniFocusDatabase.db"
    }
} as const

export const omniFocus = Knex(omnifocusCfg);
