const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

class Playlist {

  constructor(playlistData, favoriteData) {
    this.id = playlistData.id;
    this.title = playlistData.title;
    this.songCount = 0;
    this.songAvgRating = 0;
    this.favorites = [] ;
  }

 async getFavorite(favoriteId) {
    let data = database('favorites').where('id', favoriteId).first()
    return data
  }

  async addFavorite(favoriteData) {
    const promises = await favoriteData.map(async (favorite) => {
      let favoriteInfo = await this.getFavorite(favorite.favorites_id)
      return favoriteInfo
  });
  return Promise.all(promises).then(favorites => {
    favorites.forEach(favorite => {
      this.favorites.push(favorite)
    })
  });
}


}

module.exports = Playlist;
