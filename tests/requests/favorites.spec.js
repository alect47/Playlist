var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test POST api/v1/favorites', () => {
  it('should create a new favorite', async() => {
    const body = { "song_title": "beginners luck", "artist": "maribou state" }
    const res = await request(app)
                  .post("/api/v1/favorites")
                  .send(body)
    expect(res.statusCode).toBe(201)

    expect(res.body).toHaveProperty('title')
    expect(res.body.title).toBe("Beginner's Luck")

    expect(res.body).toHaveProperty('artistName')
    expect(res.body.artistName).toBe("Maribou State")

    expect(res.body).toHaveProperty('genre')
    expect(res.body.genre).toBe("Electronic")

    expect(res.body).toHaveProperty('rating')
    expect(res.body.rating).toBe(14)

    expect(res.body).toHaveProperty('id')
  })


  it('should generate error message for sad path', async() => {
    const body = { "song_title": " ", "artist": "maribou state" }
    const res = await request(app)
                  .post("/api/v1/favorites")
                  .send(body)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("Invalid song title or artist")
  })

  it('should assign unknown to genre if no genre', async() => {
    const body = { "song_title": "under pressure", "artist": "Vanilla Ice vs Queen Bowie" }
    const res = await request(app)
                  .post("/api/v1/favorites")
                  .send(body)
    expect(res.statusCode).toBe(201)
    expect(res.body.genre).toBe("Unknown")
  })
});

describe('Test GET api/v1/favorites', () => {
  beforeEach(async () => {
     await database.raw('truncate table favorites cascade');
   })
    it('should get all favorites', async() => {
      const body = { "song_title": "beginners luck", "artist": "maribou state" }
      const queenBody = { "song_title": "under pressure", "artist": "queen"}
      await request(app)
                .post("/api/v1/favorites")
                .send(body)
      await request(app)
                .post("/api/v1/favorites")
                .send(queenBody)
      const res = await request(app).get("/api/v1/favorites")

      expect(res.statusCode).toBe(200)

      expect(res.body[0]).toHaveProperty('title')
      expect(res.body[0].title).toBe("Beginner's Luck")

      expect(res.body[0]).toHaveProperty('artistName')
      expect(res.body[0].artistName).toBe("Maribou State")

      expect(res.body[0]).toHaveProperty('genre')
      expect(res.body[0].genre).toBe("Electronic")

      expect(res.body[0]).toHaveProperty('rating')
      expect(res.body[0].rating).toBe(14)

      expect(res.body[0]).toHaveProperty('id')

      expect(res.body[1].title).toBe("Under Pressure")

      expect(res.body[1].artistName).toBe("Queen")

      expect(res.body[1].genre).toBe("Rock")

      expect(res.body[1].rating).toBe(67)

      expect(res.body[1]).toHaveProperty('id')
    })

    it('should generate error message for sad path', async() => {
      const res = await request(app).get("/api/v1/favorites")

      expect(res.statusCode).toBe(404)
      expect(res.body.error).toBe("No favorites found")
    })

  afterEach(() => {
    database.raw('truncate table favorites cascade');
  });
});

describe('Test GET api/v1/favorites/:id', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');

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
    database.raw('truncate table favorites cascade');
  });

  it('should get a favorite song by id', async() => {
    let res = await request(app)
                  .get('/api/v1/favorites/2')
    expect(res.statusCode).toBe(200)

    expect(res.body).toHaveProperty('title')
    expect(res.body.title).toBe("Test Song")

    expect(res.body).toHaveProperty('artistName')
    expect(res.body.artistName).toBe("Test Artist")

    expect(res.body).toHaveProperty('genre')
    expect(res.body.genre).toBe("Test Genre")

    expect(res.body).toHaveProperty('rating')
    expect(res.body.rating).toBe(14)

    expect(res.body).toHaveProperty('id')
  })

  it('should generate error message for sad path', async() => {
    const res = await request(app)
                  .get('/api/v1/favorites/10')
    expect(res.statusCode).toBe(404)
  })
});

describe('Test DELETE api/v1/favorites/:id', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');

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
    database.raw('truncate table favorites cascade');
  });

  it('should get a favorite song by id', async() => {
    let res = await request(app)
                  .delete('/api/v1/favorites/2')
    expect(res.statusCode).toBe(204)
  })
  it('should generate error message for sad path', async() => {
    const res = await request(app)
                  .delete('/api/v1/favorites/10')
    expect(res.statusCode).toBe(404)
  })
});
