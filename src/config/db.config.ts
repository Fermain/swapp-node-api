const envSchema = require("env-schema");

const schema = {
    type: 'object',
    required: [],
    properties: {
        PORT: { type: 'string', default: 8000 },
        JWT_SECRET_KEY: { type: 'string', default: '8EB5E653C3F44EBBA007DD6364F32140' },
        DEV_HOST: { type: 'string', default: 'localhost' },
        DEV_DB_USER: { type: 'string' },
        DEV_DB_PASSWORD: { type: 'string' },
        DEV_DB_NAME: { type: 'string' }
    }
};
const config = envSchema({
    schema: schema,
    dotenv: true
});
module.exports = {
    development: {
        charset: 'utf8',
        client: 'pg',
        debug: (config.DB_DEBUG),
        pool: {
            min: 2,
            max: 10,
        },
        connection: {
            host: config.DEV_HOST || '127.0.0.1',
            user: config.DEV_DB_USER || 'root_martian',
            password: config.DEV_DB_PASSWORD || '!Martian',
            database: 'DEV_SWAPP',
            connectionTimeout: 3000,
            requestTimeout: 20000,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: `../../migrations`,
        },
    },
    production: {
        charset: 'utf8',
        client: 'pg',
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
