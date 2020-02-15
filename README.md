## Swapp API

A replica of https://barterbay.ca/


## Running knex initial migrations

1. Make sure you have mysql installed on your machine

2. Make you have knex installed globally

`$ npm install -g knex`

3. Run latest migrations

`$ knex migrate:latest --knexfile=src/config/db.config.ts`


If you run through this issue: 

`Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`

consider the solution below 

https://stackoverflow.com/a/50131831/5483182


## Running the API

`$ npm install`

`$ npm run dev` or `$ npm run start`


## API Documentation

http://localhost:3000/documentation
