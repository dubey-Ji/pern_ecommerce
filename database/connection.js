const Pool = require("pg").Pool;
const knex = require("knex");

const dbHost = process.env.DB_HOST;
const dbUserName = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

// const db = new Pool({
//   user: dbUserName,
//   password: dbPassword,
//   host: dbHost,
//   database: dbName,
//   port: dbPort,
// });

const db = knex({
  client: "pg",
  connection: {
    host: dbHost,
    user: dbUserName,
    password: dbPassword,
    database: dbName,
    port: dbPort,
  },
});

module.exports = db;
