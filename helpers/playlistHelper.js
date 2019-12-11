const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const Playlist = require('../models/playlist')

async function makePlaylists(playlists) {
  const promises = playlists.map(async (playlist) => {
    let playlistModel = await new Playlist(playlist)
    await playlistModel.getAllFavorites(playlist.id)
    await playlistModel.totalSongs()
    await playlistModel.averageRating()
    return playlistModel
});
return Promise.all(promises);
}

module.exports = {
  makePlaylists: makePlaylists,
}
