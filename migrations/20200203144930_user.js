
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').unsigned().primary();
        table.string('email_address').unique().notNullable();
        table.string('salt').notNullable();
        table.string('hashed_password').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_signed_in').nullable();
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
