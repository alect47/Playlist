const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

class Playlist {

  constructor(playlistData) {
    this.id = playlistData.id;
    this.title = playlistData.title;
    this.songCount = 0;
    this.songAvgRating = 0;
    this.favorites;
    this.created_at = playlistData.created_at;
    this.updated_at = playlistData.updated_at;
  }

 // async getFavorite(favoriteId) {
 //    let data = database('favorites').where('id', favoriteId).first()
 //    return data
 //  }

 async getAllFavorites(playlistId) {
    try {
      let response = await database('playlist_favorites')
                .select('favorites.id', 'favorites.title', 'favorites.artistName', 'favorites.genre', 'favorites.rating')
                .join('favorites', {'favorites.id': 'playlist_favorites.favorites_id'})
                .where('playlist_favorites.playlist_id', playlistId)
      this.favorites = response
    } catch(err) {
      return err;
    }
  }

  async totalSongs() {
    if (this.favorites.length) {
      this.songCount = await this.favorites.length
    }
   }

  async totalRating() {
     let rating = 0
     this.favorites.forEach(favorite => {
       rating += favorite.rating
     })
     return rating
   }

   async averageRating() {
     if (this.favorites.length) {
       let count = await this.songCount
       let totalRating = await this.totalRating()
       this.songAvgRating = (totalRating/count)
     } else {
       this.songAvgRating = 0
     }
    }

}

module.exports = Playlist;
