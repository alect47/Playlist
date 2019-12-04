var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

const musixService = require('../../../services/musixService');
const fetchMusic = musixService.fetchMusic;

router.post('/', (request, response) => {
  const song = request.body
  var title = song.song_title
  var artist = song.artist

  fetchMusic(title, artist)
    .then(musicData => {
      if(musicData) {
        database('favorites')
          .insert({ title: `${musicData.title}`, artistName: `${musicData.artistName}`, genre: `${musicData.genre}`, rating: `${musicData.rating}`}, "id")
          .returning(["id", "title", "artistName", "genre", "rating"])
          .then(data => response.status(201).send(data[0]))
        } else {
          response.status(400).json({error: "Invalid song title or artist"})
        }
    })
});

router.get('/', (request, response) => {

  // database('favorites')
  //   .insert({ title: `${musicData.title}`, artistName: `${musicData.artistName}`, genre: `${musicData.genre}`, rating: `${musicData.rating}`}, "id")
  //   .returning(["id", "title", "artistName", "genre", "rating"])
  //   .then(data => response.status(201).send(data[0]))

});

module.exports = router;
