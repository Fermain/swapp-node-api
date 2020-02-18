exports.up = function (knex) {
    return knex.schema.createTable('biddings', function (table) {
        table.uuid('id').unsigned().primary();
        table.string('name', 255).notNullable();
        table.boolean('is_complete').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_updated').defaultTo(knex.fn.now());
        table.enum('status', ['pending', 'accepted', 'rejected', 'cancelled']).notNullable();

        table.integer('bidding_user_id').notNullable().index();

        table.integer('owner_user_id').notNullable().index();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('biddings');
};
