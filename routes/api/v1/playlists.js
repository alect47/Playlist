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
                formatData(data[0])
                  .then(formattedData => {
                    response.status(201).send(formattedData)
                  })
              })
          }
        })
      }
    else {
      response.status(400).json({error: "Please provide a title"})
    }
});

router.get('/', (request, response) => {
  database('playlists').select('*')
    .then(playlists => {
      if (playlists.length) {
        formatPlaylistArray(playlists)
          .then(data => {
            response.status(200).send(data)
          })
      } else {
        response.status(404).json({ error: 'No playlists found'})
      }
    })
});

async function formatPlaylistArray(playlists){
  let playlistArray = []
  await asyncForEach(playlists, async (playlistElement) => {
    let formattedPlaylist = await new Playlist(playlistElement)
    playlistArray.push(formattedPlaylist)
  })
  return playlistArray;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
  }
}

module.exports = router;
