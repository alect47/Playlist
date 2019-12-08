exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('favorites', function(table) {
      table.integer('playlist_id').unsigned()
      table.foreign('playlist_id')
        .references('playlists.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropColumn('playlist_id')
  ])
};
