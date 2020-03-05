import knex from "knex";

const db_connection  = require("../config/db.config");
export const swappDB = knex(db_connection['development']);
