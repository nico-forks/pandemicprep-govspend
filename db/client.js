const { Client } = require('pg');
const DB_NAME = 'localhost:5432/govspend'
const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;

//const client = new Client(DB_URL); needed during development

//For developement

const client = new Client({
  connectionString: DB_URL,
  ssl: 
  process.env.DATABASE_URL ? true : false
  
});

//For heroku deployment

// const client = new Client({
//   connectionString: DB_URL,
//   ssl: 
//   {
//     rejectUnauthorized: false,
//   }
// });

module.exports = {
  client,
}

