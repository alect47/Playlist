const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');
const Favorite = require('../models/favorite')

async function fetchMusic(title, artist) {
  let response = await fetch(`http://api.musixmatch.com/ws/1.1/matcher.track.get?q_artist=${artist}&apikey=${process.env.MUSIXMATCH_API_KEY}&q_track=${title}`);
  let songs = await response.json();
  if(songs.message.body) {
    let musicData = await songs.message.body.track
    let genreData = await musicData.primary_genres.music_genre_list[0]
    let formattedFavorite = await new Favorite(musicData, genreData)
    await formattedFavorite.setGenre(genreData)
    return formattedFavorite;
  }
}

module.exports = {
  fetchMusic: fetchMusic,
}
