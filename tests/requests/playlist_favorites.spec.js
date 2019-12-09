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
