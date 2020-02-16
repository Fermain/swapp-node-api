
exports.up = function(knex) {
  return knex.schema.createTable('user_profiles', function (table) {
      table.increments('id').unsigned().primary();
      table.string('first_name').nullable();
      table.string('last_name').nullable();
      table.string('photo').nullable();
      table.string('current_city').nullable();
      table.string('province').nullable();
      table.text('bio', 'mediumtext').nullable();
      table.integer('user_id').references('id').inTable('users');
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_profiles');
};
