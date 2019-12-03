class Favorite {

  constructor(musicData, genreData) {
    this.title = musicData.track_name;
    this.artistName = musicData.artist_name;
    this.genre = genreData;
    this.rating = musicData.track_rating;
  }

  setGenre(genreData) {
    if(!genreData) {
      this.genre = "Unknown"
    }
    else {
      this.genre = genreData.music_genre.music_genre_name
    }
  }

}

module.exports = Favorite;
