exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('favorites', function(table) {
      table.integer('playlist_id').unsigned()
      table.foreign('playlist_id')
        .references('playlists.id');
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('favorites', function(table){
      table.dropColumn('playlist_id');
    })
  ])
};
