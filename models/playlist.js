class Playlist {

  constructor(playlistData, favoriteData) {
    this.id = playlistData.id;
    this.title = playlistData.title;
    this.songCount = 0;
    this.songAvgRating = 0;
    this.favorites = [];
  }

  addFavorite(favoriteData) {
    this.favorites.push(favoriteData)
  }

}

module.exports = Playlist;
