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
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

    it('should get all playlists', async() => {
      const bodyTitle1 = { "title": "Test Title 1" }
      const bodyTitle2 = { "title": "Test Title 2"}
      let playlist1 = await request(app)
                .post("/api/v1/playlists")
                .send(bodyTitle1)
      let playlist2 = await request(app)
                .post("/api/v1/playlists")
                .send(bodyTitle2)
      const res = await request(app).get("/api/v1/playlists")

      expect(res.statusCode).toBe(200)

      expect(res.body[0]).toHaveProperty('id')

      expect(res.body[0]).toHaveProperty('title')
      expect(res.body[0].title).toBe("Test Title 1")

      expect(res.body[0]).toHaveProperty('createdAt')
      expect(res.body[0].created_at).toBe(playlist1.created_at)

      expect(res.body[0]).toHaveProperty('updatedAt')
      expect(res.body[0].updated_at).toBe(playlist1.updated_at)


      expect(res.statusCode).toBe(200)

      expect(res.body[1]).toHaveProperty('id')

      expect(res.body[1]).toHaveProperty('title')
      expect(res.body[1].title).toBe("Test Title 2")

      expect(res.body[1]).toHaveProperty('createdAt')
      expect(res.body[1].created_at).toBe(playlist2.created_at)

      expect(res.body[1]).toHaveProperty('updatedAt')
      expect(res.body[1].created_at).toBe(playlist2.updated_at)
    })

    it('should generate error message for sad path', async() => {
      const res = await request(app).get("/api/v1/playlists")

      expect(res.statusCode).toBe(404)
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

    expect(res.body[0]).toHaveProperty('title')
    expect(res.body[0].title).toBe("Updated Title")
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
