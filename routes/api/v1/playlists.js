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

  database('playlists')
    .where('title', title).first()
      .then(playlist => {
        if (playlist) {
          response.status(400).send(`Playlist with title: ${title} already exists`)
        } else {
          database('playlists')
            .insert({title: title}, "id")
            .returning(["id", "title", "created_at", "updated_at"])
            .then(data => {
              // console.log(data)
              formatData(data[0])
                .then(formattedData => {
                  console.log(formattedData)
                })
              // response.status(201).send(data[0])
            })
        }
      })
});

module.exports = router;
