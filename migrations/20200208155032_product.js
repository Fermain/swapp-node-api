
exports.up = function(knex) {
  return knex.schema.createTable('products', function (table) {
    table.increments('id').unsigned().primary();
    table.string('name', 255).notNullable();
    table.text('description', 'mediumtext').notNullable();
    table.string('location', 255).notNullable();
    table.string('ideal_exchange').nullable();
    table.boolean('is_available').defaultTo(true);
    table.boolean('is_free').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('cancelled').defaultTo(false);
    table.enum('category', ['Accessories', 'Clothes', 'Electronics', 'Home']).notNullable();
    /** reference */
    table.integer('user_profile_id').references('user_profiles.id');
  });
};
exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
