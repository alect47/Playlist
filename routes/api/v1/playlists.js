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

async function formatPlaylistArray(playlists){
  console.log(playlists, "old array")
  let playlistArray = await playlists.map(playlistElement => {
    new Playlist(playlistElement)
  })
  console.log(playlistArray, "new array")
  return playlistArray;
  // playlists.map => Playlist(playlistElement)
  // return formatted array of playlists
}

router.get('/', (request, response) => {
  database('playlists').select("id", "title")
    .then(playlists => {
      if (playlists.length) {
        // iterate thru array and format attributes.
        formatPlaylistArray(playlists)
          .then(data => {
            console.log(data, "final result")
            response.status(200).send(data)
          })
      } else {
        response.status(404).json({ error: 'No playlists found'})
      }
    })
});

module.exports = router;
