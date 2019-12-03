var express = require('express');
// var favorite = require('./favorite');
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
      // this is what we want to feed to the constructor to make the hash
      console.log(musicData)
      // all tracks have a music_genre_list, but some are empty arrays, need some logic to acoount for this
      // probably in model for formatting
      // The line below is what we will give to he setGenre function in the favorite class
      // console.log(musicData.message.body.track_list[0].track.primary_genres.music_genre_list[0])
    })
  database('favorites').insert({ title: `${song}`}, "id")
        .then(data => response.status(201).send(`"message": "${song} has been added to your favorites"`))
        .catch(reason => response.send(reason.message))

  // database('users').where('api_key', request.body.api_key)
  //   .then(users => {
  //     if (users.length) {
  //       database('favorites').insert({ location: `${location}`, user_id: `${users[0].id}`}, "id")
  //         .then(data => response.status(201).send(`"message": "${location} has been added to your favorites"`))
  //         .catch(reason => response.send(reason.message))
  //     } else {
  //       response.status(401).json({
  //         error: `Unauthorized, Could not find user with api key: ${request.body.api_key}`
  //       });
  //     }
  //   })
  //   .catch(error => {
  //     response.status(500).json({ error });
  //   });
});

module.exports = router;
