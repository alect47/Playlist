var express = require('express');
var router = express.Router();


const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');
const Playlist = require('../../../models/playlist')

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

router.get('/:id/favorites', async function (request, response) {

  const playlistId = await request.params.id
  const favoriteData = await database('playlist_favorites')
    .where('playlist_id', playlistId)
    .then(play_faves => {
      return play_faves
    })

  const playlistData = await database('playlists').where('id', playlistId)
    .then(playlists => {
      if (playlists.length) {
        return playlists[0]
      } else {
        response.status(404).json({ error: 'No playlists found'})
      }
    })
    
  let favoriteModel = await new Playlist(playlistData, favoriteData )
  await favoriteModel.addFavorite(favoriteData)
  // await console.log(favoriteModel)
  await database('playlists').where('id', playlistId)
    .then(playlists => {
      console.log(favoriteModel)
      // if (playlists.length) {
      //   response.status(200).send(favoriteModel)
      // } else {
      //   response.status(404).json({ error: 'No playlists found'})
      // }
    })
});

router.post('/:id/favorites/:favorite_id', async (request, response) => {
  const playlistId = request.params.id
  const favoriteId = request.params.favorite_id
  const songTitle = await database('favorites').where('id', favoriteId).first()
      .then(song => {
        if (song) {
          return song.title
        }
        else {
          return false
        }
      })

  const playlistTitle = await database('playlists').where('id', playlistId).first()
      .then(playlist => {
        if (playlist) {
          return playlist.title
        } else {
          return false
        }
      })

    const playlistFav = await database('playlist_favorites')
          .where({'playlist_id': playlistId, 'favorites_id': favoriteId})
          .first()
          .then(playFav => {
            if (playFav) {
              return true
            } else {
              return false
            }
          })

  if (!playlistFav && songTitle && playlistTitle) {
    database('playlist_favorites')
      .insert({playlist_id: playlistId, favorites_id: favoriteId}, "id")
        .then(playlistFavorite => {
          response.status(201).json( {success: `${songTitle} has been added to ${playlistTitle}!`})
        })
      }
    else {
      response.sendStatus(400)
    }
});

module.exports = router;
