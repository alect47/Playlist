var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test POST api/v1/playlists', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  it('should create a new playlist', async() => {
    const body = { "title": "Cleaning House" }
    const res = await request(app)
                  .post("/api/v1/playlists")
                  .send(body)
    expect(res.statusCode).toBe(201)

    expect(res.body).toHaveProperty('title')
    expect(res.body.title).toBe("Cleaning House")

    expect(res.body).toHaveProperty('created_at')

    expect(res.body).toHaveProperty('updated_at')

    expect(res.body).toHaveProperty('id')
  })


  it('should generate error message for sad path', async() => {
    const body = { "title": "" }
    const res = await request(app)
                  .post("/api/v1/playlists")
                  .send(body)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("Please provide a title")
  })

  it('should notify user if title already exists', async() => {
    let playlistData = {
      id: 1,
      title: "Cleaning House",
    }
    await database('playlists').insert(playlistData);

    const body = { "title": "Cleaning House" }
    const res = await request(app)
                  .post("/api/v1/playlists")
                  .send(body)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("Playlist with title: Cleaning House already exists")
  })
});

describe('Test GET api/v1/playlists', () => {
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

    it('should get all playlists and associated favorites', async() => {
      const res = await request(app).get("/api/v1/playlists")

      expect(res.statusCode).toBe(200)

      expect(res.body[0]).toHaveProperty('id')

      expect(res.body[0]).toHaveProperty('title')
      expect(res.body[0].title).toBe("Cleaning House")

      expect(res.body[0]).toHaveProperty('created_at')

      expect(res.body[0]).toHaveProperty('updated_at')

      expect(res.body[0]).toHaveProperty('songCount')
      expect(res.body[0].songCount).toBe(2)

      expect(res.body[0]).toHaveProperty('songAvgRating')
      expect(res.body[0].songAvgRating).toBe(14.5)

      expect(res.body[0]).toHaveProperty('favorites')
      expect(res.body[0].favorites[0].title).toBe('Test Song')

      expect(res.body[1]).toHaveProperty('favorites')
      expect(res.body[1].favorites.length).toBe(0)


      expect(res.statusCode).toBe(200)

      expect(res.body[1]).toHaveProperty('id')

      expect(res.body[1]).toHaveProperty('title')
      expect(res.body[1].title).toBe("Cleaning House")

      expect(res.body[1]).toHaveProperty('created_at')

      expect(res.body[1]).toHaveProperty('updated_at')
    })

    it('should generate error message for sad path', async() => {
      await database.raw('truncate table playlists cascade');
      await database.raw('truncate table favorites cascade');
      await database.raw('truncate table playlist_favorites cascade');
      const res = await request(app).get("/api/v1/playlists")

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("No playlists found")
    })
});

describe('Test PUT api/v1/playlists/:id', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlistData = {
      id: 1,
      title: "Cleaning House",
    }
    await database('playlists').insert(playlistData);
  });

  it('should update a playlist by id', async() => {
    let body = {"title": "Updated Title"}
    const res = await request(app)
                  .put('/api/v1/playlists/1')
                  .send(body)
    expect(res.statusCode).toBe(200)

    expect(res.body).toHaveProperty('title')
    expect(res.body.title).toBe("Updated Title")
  })

  it('should generate error message for sad path', async() => {
    const res = await request(app)
                  .put('/api/v1/playlists/10')
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("Please provide a title")
  })

  it('should generate error for resource not found', async() => {
    let body = {"title": "Updated Title"}
    const res = await request(app)
                  .put('/api/v1/playlists/10')
                  .send(body)
    expect(res.statusCode).toBe(404)
  })

  it('should not allow duplicate titles', async() => {
    let body = {"title": "Cleaning House"}

    const res = await request(app)
                  .put('/api/v1/playlists/10')
                  .send(body)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("Playlist with title: Cleaning House already exists")
  })
});

describe('Test DELETE api/v1/playlists/:id', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlistData = {
      id: 1,
      title: "Cleaning House",
    }
    await database('playlists').insert(playlistData);
  });

  it('should delete a playlist song by id', async() => {
    let res = await request(app)
                  .delete('/api/v1/playlists/1')
    expect(res.statusCode).toBe(204)
  })
  it('should generate error message for sad path', async() => {
    const res = await request(app)
                  .delete('/api/v1/playlists/10')
    expect(res.statusCode).toBe(404)
  })
});
