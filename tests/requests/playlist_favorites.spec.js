var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test POST api/v1/playlists/:id/favorites/:favorite_id', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlist_favorites cascade');

    let playlistData = {
      id: 1,
      title: "Cleaning House",
    }
    await database('playlists').insert(playlistData);

    let songData = {
      id: 2,
      title: "Test Song",
      artistName: "Test Artist",
      genre: "Test Genre",
      rating: 14
    };
    await database('favorites').insert(songData);
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
    database.raw('truncate table favorites cascade');
    database.raw('truncate table playlist_favorites cascade');
  });

  it('should create a new playlist_favorite record', async() => {
    const res = await request(app)
                  .post("/api/v1/playlists/1/favorites/2")

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe("Test Song has been added to Cleaning House!")
  })

  it('should not allow a playlist_favorite to be created twice', async() => {
    const res = await request(app)
                  .post("/api/v1/playlists/1/favorites/2")
    const secondRes = await request(app)
                  .post("/api/v1/playlists/1/favorites/2")

    expect(secondRes.statusCode).toBe(400)
  })

  it('should not allow a playlist_favorite to be created with invalid playlist id', async() => {
    const res = await request(app)
                  .post("/api/v1/playlists/2/favorites/2")

    expect(res.statusCode).toBe(400)
  })
  it('should not allow a playlist_favorite to be created with invalid favorite id', async() => {
    const res = await request(app)
                  .post("/api/v1/playlists/1/favorites/3")

    expect(res.statusCode).toBe(400)
  })
});

describe('Test GET /api/v1/playlists/id/favorites', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlist_favorites cascade');

    let playlistData = {
      id: 1,
      title: "Cleaning House",
    }

    let playlistDataTwo = {
      id: 2,
      title: "Cleaning House",
    }

    let songData = {
      id: 2,
      title: "Test Song",
      artistName: "Test Artist",
      genre: "Test Genre",
      rating: 14
    };

    let otherSongData = {
      id: 3,
      title: "Test Song 2",
      artistName: "Test Artist 2",
      genre: "Test Genre",
      rating: 15
    };

    let playlistFavorite = {
      id: 1,
      playlist_id: 1,
      favorites_id: 2,
    }
    let otherPlaylistFavorite = {
      id: 2,
      playlist_id: 1,
      favorites_id: 3,
    }
      await database('playlists').insert(playlistData);
      await database('playlists').insert(playlistDataTwo);
      await database('favorites').insert(otherSongData);
      await database('favorites').insert(songData);
      await database('playlist_favorites').insert(playlistFavorite);
      await database('playlist_favorites').insert(otherPlaylistFavorite);
    });

      afterEach(() => {
        database.raw('truncate table playlists cascade');
        database.raw('truncate table favorites cascade');
        database.raw('truncate table playlist_favorites cascade');
      });

      it('should get a playlist by id as well as an array of songs', async() => {
        const res = await request(app)
                      .get("/api/v1/playlists/1/favorites")

        expect(res.statusCode).toBe(200)

        expect(res.body).toHaveProperty('id')
        expect(res.body.id).toBe(1)

        expect(res.body).toHaveProperty('title')
        expect(res.body.title).toBe("Cleaning House")

        expect(res.body).toHaveProperty('songCount')
        expect(res.body.songCount).toBe(2)

        expect(res.body).toHaveProperty('songAvgRating')
        expect(res.body.songAvgRating).toBe(14.5)

        expect(res.body).toHaveProperty('favorites')
        expect(res.body.favorites[0].title).toBe('Test Song')
      })
      it('should get a 404 if invalid playlist id', async() => {
        const res = await request(app)
                      .get("/api/v1/playlists/100/favorites")

        expect(res.statusCode).toBe(400)
      })

      it('should return empty array if no favorites', async() => {
        const res = await request(app)
                      .get("/api/v1/playlists/2/favorites")

        expect(res.statusCode).toBe(200)

        expect(res.body).toHaveProperty('favorites')
        expect(res.body.favorites.length).toBe(0)
      })
    });
    

describe('Test DELETE api/v1/playlists/:id/favorites/:favorite_id', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlist_favorites cascade');

    let playlist = {
      id: 1,
      title: "Test Playlist",
    }
    await database('playlists').insert(playlist);

    let song1 = {
      id: 2,
      title: "Test Song 1",
      artistName: "Test Artist 1",
      genre: "Test Genre 1",
      rating: 14
    };
    await database('favorites').insert(song1);

    let song2 = {
      id: 3,
      title: "Test Song 2",
      artistName: "Test Artist 2",
      genre: "Test Genre 2",
      rating: 15
    };

    await database('favorites').insert(song2);

    let playlistFavorite = {
      id: 1,
      playlist_id: playlist.id,
      favorites_id: song1.id
    }
    await database('playlist_favorites').insert(playlistFavorite);
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
    database.raw('truncate table favorites cascade');
    database.raw('truncate table playlist_favorites cascade');
  });



  it('should delete a favorite from a playlist', async() => {
    const res = await request(app)
                  .delete("/api/v1/playlists/1/favorites/2")

    expect(res.statusCode).toBe(204)

// checks that playlist was not deleted from Playlists table
    const allPlaylists = await request(app)
                  .get('/api/v1/playlists')

    expect(allPlaylists.body[0].title).toBe("Test Playlist")
    expect(allPlaylists.body[0].id).toBe(1)

// checks that the song was not deleted from Favorites table
    const allSongs = await request(app)
                  .get('/api/v1/favorites')

    expect(allSongs.body[0].title).toBe("Test Song 1")
    expect(allSongs.body[0].id).toBe(2)

    expect(allSongs.body[1].title).toBe("Test Song 2")
    expect(allSongs.body[1].id).toBe(3)
  })

  it('should not delete if record is not found', async() => {
    const res = await request(app)
                  .delete("/api/v1/playlists/2/favorites/4")

    expect(res.statusCode).toBe(404)

  })
});
