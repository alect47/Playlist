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
    connection: `${process.env.STAGING_DB}`,
    // connection: 'postgres://jbtgbgdwjucbaj:6200234cfea52892ab933ebd5d4de153976f8d0e758ec762211a921fb9718d67@ec2-174-129-255-46.compute-1.amazonaws.com:5432/d469hfan6hj3ut',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
