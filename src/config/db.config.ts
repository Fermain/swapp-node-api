import envSchema from "env-schema";

const schema = {
    type: 'object',
    required: ['DEV_HOST', 'DEV_DB_PASSWORD', 'DEV_DB_USER', 'DEV_DB_NAME'],
    properties: {
        PORT: { type: 'string', default: 8000 },
        JWT_SECRET_KEY: { type: 'string', default: '8EB5E653C3F44EBBA007DD6364F32140' },
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
export const db_connections = {
    development: {
        charset: 'utf8',
        client: 'mysql',
        debug: (config.DB_DEBUG),
        pool: {
            min: 2,
            max: 10,
        },
        connection: {
            host: config.DEV_HOST,
            user: config.DEV_DB_USER,
            password: config.DEV_DB_PASSWORD,
            database: config.DEV_DB_NAME,
            connectionTimeout: 3000,
            requestTimeout: 20000,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: `../migrations`,
        },
    },
    production: {
        charset: 'utf8',
        client: 'mysql',
        debug: config.DB_DEBUG,
        pool: {
            min: 2,
            max: 10,
        },
        connection: {
            host: 'xxx.xxx.xx.xx',
            user: 'xxx',
            password: 'xxx',
            database: 'xxx',
            connectionTimeout: 3000,
            requestTimeout: 20000,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: `../migrations`,
        },
    },
};
