// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/playlist_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/playlist_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: `${process.env.PRODUCTION_DB}`,
    // connection: 'postgres://mztouxgmsntjsh:5908998545484fb1a334ac1123311ecbded76f60212e6fe658de5fa154e3ce4c@ec2-174-129-255-76.compute-1.amazonaws.com:5432/d29t0b8jgphgn',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  staging: {
    client: 'pg',
    // connection: 'postgres://jbtgbgdwjucbaj:6200234cfea52892ab933ebd5d4de153976f8d0e758ec762211a921fb9718d67@ec2-174-129-255-46.compute-1.amazonaws.com:5432/d469hfan6hj3ut',
    connection: `${process.env.STAGING_DB}`,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
