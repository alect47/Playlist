var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test POST api/v1/playlists', () => {
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
    await database('playlists').insert(playlistDAta);

    const body = { "title": "Cleaning House" }
    const res = await request(app)
                  .post("/api/v1/playlists")
                  .send(body)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("Title already exists")
  })
});
