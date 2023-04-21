# Northcoders News API

## Background

The bootcamp task was to build an API for the purpose of accessing application data programmatically. The intention was to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

### Connection

To successfully connect to the two databases locally I did these steps:

- installed `dotenv` npm package: https://www.npmjs.com/package/dotenv
- created two .env files for the project: `.env.test` and `.env.development`

#### Environment variables

I also created environment variables to clone original project and run it locally.

- added `PGDATABASE=nc_news_test` to the `.env.test` file and `PGDATABASE=nc_news` to the `.env.development` file
- gitignored these two files
- set all of the environment variables from the `.env` file to the `process.env`:
  required dotenv into the file and invoked its config method.
  `in our db file where we set up our connection to the database`:
  require('dotenv').config();
  const { Pool } = require('pg');
  module.exports = new Pool();
