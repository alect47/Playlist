exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('playlist_favorites', function(table) {
      table.increments('id').primary();
      table.integer('playlist_id').unsigned()
      table.foreign('playlist_id')
        .references('playlists.id').onDelete('CASCADE');
      table.integer('favorites_id').unsigned()
      table.foreign('favorites_id')
        .references('favorites.id').onDelete('CASCADE');
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('playlist_favorites')
  ])
};
