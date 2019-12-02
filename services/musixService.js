const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');
// const Favorite = require('../models/favorite')

async function fetchMusic(title, artist) {
  let response = await fetch(`  http://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist}&s_track_rating=desc&apikey${process.env.MUSIXMATCH_API_KEY}=&q_track=${title}`);
  let songs = await response.json();
  console.log(songs)
  return songs;
}

module.exports = {
  fetchMusic: fetchMusic,
}
