class Favorite {

  constructor(musicData, genreData) {
    this.title = musicData.track_name;
    this.artistName = musicData.artist_name;
    this.genre = genreData;
    this.rating = musicData.track_rating;
  }

// This function isn't working, but it could be useful, otherwise need to set a default value
// in the database
// Might need to make it an async
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
