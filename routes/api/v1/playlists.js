var express = require('express');
var router = express.Router();


const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');
const Playlist = require('../../../models/playlist')

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
        
        console.log(playlists)
        response.status(200).send(playlists)
      } else {
        response.status(400).json({ error: 'No playlists found'})
      }
    })
});

async function findPlaylist(id) {
  try {
    let response = await database('playlists').where('id', id)
    return response;
  } catch(err) {
    return err;
  }
}

router.get('/:id/favorites', async function (request, response) {

  const playlistId = await request.params.id

  findPlaylist(playlistId)
    .then(async playlist => {
      if (playlist.length) {
        let favoriteModel = await new Playlist(playlist[0])
        await favoriteModel.getAllFavorites(playlistId)
        await favoriteModel.totalSongs()
        await favoriteModel.averageRating()
        response.status(200).send(favoriteModel)
      } else {
        response.status(400).json({
          error: `No playlist found with that id`
        });
      }

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

router.delete('/:id/favorites/:favorite_id', async (request, response) => {
  let playlistId = request.params.id
  let favoriteId = request.params.favorite_id

  let playlistRecord = await database('playlists').where('id', playlistId).first()
  let songRecord = await database('favorites').where('id', favoriteId).first()

  if (playlistRecord && songRecord) {
    database('playlist_favorites')
      .where({playlist_id: playlistId, favorites_id: favoriteId})
      .then(data => {
        if (data) {
          database('playlist_favorites')
            .where({playlist_id: playlistId, favorites_id: favoriteId})
            .first()
            .del()
            .then(response.sendStatus(204))
          } else {
            response.sendStatus(404)
          }
      })
  } else {
    response.status(404).send("Invalid playlist or song")
  }
});

module.exports = router;
