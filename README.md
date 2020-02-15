## Swapp API

A replica of https://barterbay.ca/


## Running knex initial migrations

1. Make sure you have mysql installed on your machine

2. Make you have knex installed globally

`$ npm install -g knex`

3. Run latest migrations

`$ knex migrate:latest --knexfile=src/config/db.config.ts`

## Running the API

`$ npm install`

`$ npm run dev` or `$ npm run start`


## API Documentation

http://localhost:3000/documentation
