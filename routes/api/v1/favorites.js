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

router.get('/:id', (request, response) => {
  let songId = request.params.id

  
  database('favorites').where('id', songId).first().select('id', 'title', 'artistName', 'genre', 'rating')
    .then(songDetails => {
      response.status(200).send(songDetails)
    })
// respond with JSON object & status code of 200
// return only if id exists, else send status code of 404

});

module.exports = router;
