var express = require('express');
var router = express.Router();
const Playlist = require('../../../models/playlist')


const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

async function formatData(data) {
  let playlist = await new Playlist(data);
  return playlist;
}

router.post('/', (request, response) => {
  const title = request.body.title

  if (title.length) {
    database('playlists')
      .where('title', title).first()
        .then(playlist => {
          if (playlist) {
            response.status(400).json({error: `Playlist with title: ${title} already exists`})
          } else {
            database('playlists')
              .insert({title: title}, "id")
              .returning(["id", "title", "created_at", "updated_at"])
              .then(data => {
                response.status(201).send(data[0])
              })
          }
        })
      }
    else {
      response.status(400).json({error: "Please provide a title"})
    }
});

router.put('/:id', (request, response) => {
  let playlistId = request.params.id
  let title = request.body.title

  if (title) {
    database('playlists').where('title', title)
      .then(playlist => {
        if (playlist.length) {
          response.status(400).json({error: `Playlist with title: ${title} already exists`})
        }
        else {
          database('playlists').where('id', playlistId).first()
            .then(playlistRecord => {
              if (playlistRecord) {
                database('playlists').where('id', playlistId)
                .update({title: title})
                .returning(["id", "title", "created_at", "updated_at"])
                .then(data => response.status(200).send(data[0]))
              } else {
                response.sendStatus(404)
              }
            })
        }
      })
    }
  else {
    response.status(400).json({error: "Please provide a title"})
  }
});

router.delete('/:id', (request, response) => {
  let playlistId = request.params.id
  database('playlists').where('id', playlistId).first()
    .then(playlistRecord => {
      if (playlistRecord) {
        database('playlists')
          .where('id', playlistId)
          .first()
          .del()
            .then(response.sendStatus(204))
      } else {
        response.sendStatus(404)
      }
    })
});

router.get('/', (request, response) => {
  database('playlists').select('*')
    .then(playlists => {
      if (playlists.length) {
        response.status(200).send(playlists)
      } else {
        response.status(404).json({ error: 'No playlists found'})
      }
    })
});

module.exports = router;
