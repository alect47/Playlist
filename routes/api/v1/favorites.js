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

async function allFavorites() {
  try {
    let response = await database('favorites').select("id", "title", "artistName", "genre", "rating")
    return response;
  } catch(err) {
    return err;
  }
}

async function favorite(songId) {
  try {
    let response = await database('favorites')
      .where('id', songId)
      .first()
      .select('id', 'title', 'artistName', 'genre', 'rating')
    return response;
  } catch(err) {
    return err;
  }
}

router.get('/', (request, response) => {
  allFavorites()
    .then(faves => {
      if (faves.length) {
        response.status(200).send(faves)
      } else {
        response.status(404).json({
          error: `No favorites found`
        });
      }
    })
  });

router.get('/:id', (request, response) => {
  let songId = request.params.id
  database('favorites').where('id', songId).first()
    .then(songRecord => {
      if (songRecord) {
        favorite(songId)
            .then(songData => {
              response.status(200).send(songData)
            })
      } else {
        response.sendStatus(404)
      }
    })
});

router.delete('/:id', (request, response) => {
  let songId = request.params.id
  database('favorites').where('id', songId).first()
    .then(songRecord => {
      if (songRecord) {
        database('favorites')
          .where('id', songId)
          .first()
          .del()
            .then(response.sendStatus(204))
      } else {
        response.sendStatus(404)
      }
    })
});

module.exports = router;
