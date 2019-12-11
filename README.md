# Playlist

#### Contributors:
* [Alec Wells](https://github.com/alect47)
* [Smitha Hosmani](https://github.com/hsmitha26)

A paired project completed in 10 days in Module 4 of Backend Engineering at Turing School of Software and Design.

This Express app consumes MusixMatch API and exposes endpoints that return song data and playlist data.  The data format adheres to project specs provided by our instructors for each sprint.

## Areas of focus:
* Create an Express API given specified endpoints and response formats
* Testing using Jest, with coverage at or above 95%
* Continuous integration using Travis CI
* Project management using [GitHub Projects](https://github.com/alect47/Playlist/projects/1)
* Advanced git workflow using development, staging and production environments
* Agile workflow - building project in sprints, daily standups, writing detailed user stories
* Deploying to staging and production environments each feature only after it was fully tested and functional in development.

<!-- add updated Travis CI links -->
[![Build Status](https://travis-ci.com/turingschool-examples/all-your-base.svg?branch=master)](https://travis-ci.com/turingschool-examples/all-your-base)

## Tech Stack

* [Express for Node.js](https://expressjs.com/)
* [JavaScript](https://devdocs.io/javascript/)
* [Jest](https://jestjs.io/)
* [Knex.js](http://knexjs.org/)
* [PostgreSQL](https://www.postgresql.org/)

## Local Setup

Before cloning the repository:
* You will need to register and get an API key from [Musix Match](https://developer.musixmatch.com/)
* Download [Postman](https://www.getpostman.com/)

* `git clone git@github.com:alect47/Playlist.git`
* `npm install` to install necessary dependencies
* Add `.env` file in the root directory and add your API keys:
  * `MUSIXMATCH_API_KEY=<your Musix Match API Key>`

To run the server: `npm start`
* Local server: `http://localhost:3000`
* Production site: `https://playlist-express.herokuapp.com/`

#### Set up your local database
You’ll need to figure out a name for your database. We suggest calling it something like `playlist_dev` and `playlist_test` for testing.

We also suggest using [Postico](https://eggerapps.at/postico/) to track the changes to your database, you can also edit your tables in Postico.

To get things set up, you’ll need to access your PostgreSQL instance by typing in `psql` into your terminal. Once there, you can create your database. Instructions to create database:
```
psql
CREATE DATABASE DATABASE_NAME_dev;
\q
```

Now you have a database for your test and development environments.

#### Migrations
Once you have your database setup, you’ll need to run some migrations. You can do this by running the following command:

`knex migrate:latest` for development


#### Set up your test database
Most of the setup is going to be same as the one you did before. You’ll notice one small difference with setting the environment flag to `test`.  

```
psql
CREATE DATABASE DATABASE_NAME_test;
\q
```

`knex migrate:latest --env test`


#### Running your tests
Running tests are simple and require you to run the following command below:

`npm test`

When the tests have completed, you’ll get a read out of how things panned out.

## Running in Postman
In Postman, append the url to expose the below endpoints or click the `Run in Postman` button.


### Endpoints
1. [POST /api/v1/favorites](#post-favorites)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/fea5aca46bf51d4b559e)
2. [GET /api/v1/favorites](#get-favorites-index)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/55c671d7f662fb8e1f19)
3. [GET /api/v1/favorites/:id](#get-favorites-show) [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/d332f8e3bafb3e3169cd)
4. [DELETE /api/v1/favorites](#delete-favorites)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/75f1ceae19444b5801ea)
5. [POST /api/v1/playlists](#post-playlists)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3fefb103efbbfd603c12)
6. [GET /api/v1/playlists](#get-playlists-index)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/065285e1d0f5804951a9)
7. [PUT /api/v1/playlists/:id](#put-playlists)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c13b4417c4908e2cb820)
8. [DELETE /api/v1/playlists/:id](#delete-playlists)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9fb85feeced009d372bf)
9. [POST /api/v1/playlists/:id/favorites/:favorite_id](#post-playlist-favorites)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/6b065a4284d434892103)
10. [GET /api/v1/playlists/:id/favorites](#get-playlist-favorites)  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/287ce413fd2959ddc4b6)
11. [DELETE /api/v1/playlists/:id/favorites/:favorite_id](#delete-playlist-favorites) [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/7cc303b88bb5f312b220)

### Song Endpoints

<!-- <a name="post-favorites"/> -->

#### Request:
##### POST /api/v1/favorites
<!-- [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/fea5aca46bf51d4b559e) -->
```
body:
{
  "song_title": "We Will Rock You",
  "artist": "Queen",
}
```
#### Expected Successful Response:
```
status: 201
body:
{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen"
  "genre": "Rock",
  "rating": 88
}
```
<a name="get-favorites-index"/>
#### Request:
##### GET /api/v1/favorites
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/55c671d7f662fb8e1f19)

#### Expected Successful Response:
```
[
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  },
  {
    "id": 2,
    "title": "Careless Whisper",
    "artistName": "George Michael"
    "genre": "Pop",
    "rating": 93
  },
]
```
<a name="get-favorites-show"/>
#### Request:
##### GET /api/v1/favorites/:id
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/d332f8e3bafb3e3169cd)

#### Expected Successful Response:
```
{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen"
  "genre": "Rock",
  "rating": 88
}
```
<a name="delete-favorites"/>
#### Request:
##### DELETE /api/v1/favorites/:id
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/75f1ceae19444b5801ea)

#### Expected Successful Response:
`status code 204`

### Playlist Endpoints
<a name="post-playlists"/>
#### Request:
##### POST /api/v1/playlists
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3fefb103efbbfd603c12)

```
body:
{
  "title": "Cleaning House"
}
```
#### Expected Successful Response:
```
status: 201
body:
{
  "id": 1,
  "title": "Cleaning House",
  "created_at": 2019-11-26T16:03:43+00:00,
  "updated_at": 2019-11-26T16:03:43+00:00,
}
```
<a name="get-playlists-index"/>
#### Request:
##### GET /api/v1/playlists
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/065285e1d0f5804951a9)

#### Expected Successful Response:
```
status: 200
body:
[
  {
    "id": 1,
    "title": "Cleaning House",
    "created_at": 2019-11-26T16:03:43+00:00,
    "updated_at": 2019-11-26T16:03:43+00:00
  },
  {
    "id": 2,
    "title": "Running Mix",
    "created_at": 2019-11-26T16:03:43+00:00,
    "updated_at": 2019-11-26T16:03:43+00:00
  },
]
```
<a name="put-playlists"/>
#### Request:
##### PUT /api/v1/playlists/:id
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c13b4417c4908e2cb820)

```
body:
{
  "title": "Updated Title"
}
```
#### Expected Successful Response:
```
status: 200
body:
{
    "id": 1,
    "title": "Updated Title",
    "created_at": 2019-11-26T16:03:43+00:00,
    "updated_at": 2019-11-26T16:03:43+00:00
  }
```
<a name="delete-playlists"/>
#### Request:
##### DELETE /api/v1/playlists/:id
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9fb85feeced009d372bf)

#### Expected Successful Response:
```
status: 204
```

### Playlist-Songs Endpoints
<a name="post-playlist-favorites"/>
#### Request:
##### POST /api/v1/playlists/:id/favorites/:favorite_id
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/6b065a4284d434892103)

#### Expected Successful Response:
```
status: 201
body:
"Success": "We Will Rock You has been added to Cleaning House!"
```
<a name="get-playlist-favorites"/>
#### Request:
##### GET /api/v1/playlists/:id/favorites
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/287ce413fd2959ddc4b6)

#### Expected Successful Response:
```
status: 200
body:
{
  "id": 1,
  "title": "Cleaning House",
  "songCount": 2,
  "songAvgRating": 27.5,
  "favorites" : [
                  {
                    "id": 1,
                    "title": "We Will Rock You",
                    "artistName": "Queen"
                    "genre": "Rock",
                    "rating": 25
                  },
                  {
                    "id": 4,
                    "title": "Back In Black",
                    "artistName": "AC/DC"
                    "genre": "Rock",
                    "rating": 30
                  }
               ],
    "created_at": 2019-11-26T16:03:43+00:00,
    "updated_at": 2019-11-26T16:03:43+00:00
}
```

<a name="delete-playlist-favorites"/>
#### Request:
##### DELETE /api/v1/playlists/:id/favorites/:favorite_id
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/7cc303b88bb5f312b220)

#### Expected Successful Response:
```
status: 204
```
