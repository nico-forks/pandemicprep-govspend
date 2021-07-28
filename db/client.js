const { Client } = require('pg');
const DB_NAME = 'localhost:5432/govspend'
const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;

//const client = new Client(DB_URL); needed during development

const client = new Client({
  connectionString: DB_URL,
  ssl: 
  {
    rejectUnauthorized: false,
  }
});

module.exports = {
  client,
}

// const client = new Client({
//   connectionString: DB_URL,
//   ssl: 
//   process.env.DATABASE_URL ? true : false
  
// });