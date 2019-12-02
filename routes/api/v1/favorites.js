var express = require('express');
// var favorite = require('./favorite');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

const helpers = require('../../../services/musixService');
const fetchMusic = helpers.fetchMusic;

router.post('/', (request, response) => {
  const song = request.body
  var title = song.song_title
  var artist = song.artist
  fetchMusic(title, artist)
    .then(musicData => {
      console.log(musicData)
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
