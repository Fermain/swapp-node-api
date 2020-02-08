
exports.up = function(knex) {
    return knex.schema.createTable('categories', function (table) {
        table.increments('id').unsigned().primary();
        table.string('name', 255).notNullable();
        table.text('short_description', 'mediumtext').notNullable();
        table.string('icon', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.boolean('cancelled').defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('categories');
};
