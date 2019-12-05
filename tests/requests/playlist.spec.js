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

    expect(res.body).toHaveProperty('createdAt')

    expect(res.body).toHaveProperty('updatedAt')

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
   })
    it('should get all favorites', async() => {
      const bodyTitle1 = { "title": "Test Title 1" }
      const bodyTitle2 = { "title": "Test Title 2"}
      await request(app)
                .post("/api/v1/playlists")
                .send(bodyTitle1)
      await request(app)
                .post("/api/v1/playlists")
                .send(bodyTitle2)
      const res = await request(app).get("/api/v1/playlists")

      expect(res.statusCode).toBe(200)

      expect(res.body[0]).toHaveProperty('id')

      expect(res.body[0]).toHaveProperty('title')
      expect(res.body[0].title).toBe("Test Title 1")

      expect(res.body[0]).toHaveProperty('createdAt')
      // expect(res.body[0].created_at).toBe(" ")

      expect(res.body[0]).toHaveProperty('updatedAt')
      // expect(res.body[0].updated_at).toBe("")


      expect(res.statusCode).toBe(200)

      expect(res.body[1]).toHaveProperty('id')

      expect(res.body[1]).toHaveProperty('title')
      expect(res.body[1].title).toBe("Test Title 1")

      expect(res.body[1]).toHaveProperty('createdAt')
      // expect(res.body[1].created_at).toBe(" ")

      expect(res.body[1]).toHaveProperty('updatedAt')
      // expect(res.body[1].updated_at).toBe("")
    })

    it('should generate error message for sad path', async() => {
      const res = await request(app).get("/api/v1/playlists")

      expect(res.statusCode).toBe(404)
      expect(res.body.error).toBe("No playlists found")
    })

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });
});
