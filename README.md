# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

### Connection

You must do these steps to successfully connect to the two databases locally:

- install `dotenv` npm package: https://www.npmjs.com/package/dotenv
- create two .env files for the project: `.env.test` and `.env.development`

#### Environment variables

Create environment variables if you wish to clone this project and run it locally.

- add `PGDATABASE=nc_news_test` to the `.env.test` file and `PGDATABASE=nc_news` to the `.env.development` file
- gitignore these two files
- set all of the environment variables from the `.env` file to the `process.env`:
  require dotenv into the file and invoke its config method.
  `in our db file where we set up our connection to the database`:
  require('dotenv').config();
  const { Pool } = require('pg');
  module.exports = new Pool();
