## Swapp API

A replica of https://barterbay.ca/


## Running knex initial migrations

1. This api uses PostgreSQL 

2. Make you have knex installed globally

`$ npm install -g knex`

3. Run latest migrations

`$ knex migrate:latest --knexfile=src/config/db.config.ts`

## Running the API

`$ npm install`

`$ npm run dev` or `$ npm run start`


## Swagger docs and API testing

http://localhost:8000/documentation




## API Calls

#### Auth

`/register` - user registration

`/token` - get an auth token


### User pofile managment

`/profile` - creates a user profile

`/profile{id}` - get the user's profile

`/profile/avatar` - upload the user's profile picture


### Products management

`/product` - creates a product

`/product/{id}/images` - uploads product images

`/products/?limit={number}&page={number}` - get a list of products and 1 image for each

`/product/{id}` - gets a single product and it's images



### ISSUES

Validating schema on a multipart form request is a pain in the neck.  

It seems easier to just make separate endpoints for files, than put them on the same request with text fields
