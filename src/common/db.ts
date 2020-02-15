import envSchema from "env-schema";
import knex from "knex";
import * as db_connections from "../config/db.config";

const schema = {
    type: 'object',
    required: ['DEV_HOST', 'DEV_DB_PASSWORD', 'DEV_DB_USER', 'DEV_DB_NAME'],
    properties: {
        NODE_ENV: { type: 'string', default: 'development'},
        DEV_HOST: { type: 'string' },
        DEV_DB_USER: { type: 'string' },
        DEV_DB_PASSWORD: { type: 'string' },
        DEV_DB_NAME: { type: 'string' }
    }
};
const config = envSchema({
    schema: schema,
    dotenv: true
});

export const swappdb = knex(db_connections.development);
