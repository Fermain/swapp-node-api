
exports.up = function(knex) {
  return knex.schema.createTable('product_images', function (table) {
    table.uuid('id').unsigned().primary();
    table.string('image_path').notNullable();
    table.integer('product_id')
        .references('id').inTable('products');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('product_images');
};
