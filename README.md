# Playlist

#### Contributors:
* [Alec Wells](https://github.com/alect47)
* [Smitha Hosmani](https://github.com/hsmitha26)

A paired project completed in 10 days in Module 4 of Backend Engineering at Turing School of Software and Design.

This Express app consumes MusixMatch API and exposes endpoints that return song data and playlist data.  The data format adheres to project specs provided by our instructors for each sprint.

Areas of focus:
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
* you will need to register and get an API key from [Musix Match](https://developer.musixmatch.com/)
* download [Postman](https://www.getpostman.com/)

* `git clone git@github.com:alect47/Playlist.git`
* `npm install` to install necessary dependencies
* Add `.env` file in the root directory and add your API keys:
  * `MUSIXMATCH_API_KEY=<your Musix Match API Key>`

To run the server: `npm start`
* local server: `http://localhost:3000`
* production site: `https://playlist-express.herokuapp.com/`

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
### Song Data
#### Request:
```
POST /api/v1/favorites

body:
{
  "title": "We Will Rock You",
  "artistName": "Queen",
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
