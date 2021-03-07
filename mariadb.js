const config = require("./config.json");
const mariadb = require("mariadb");

const sql = mariadb.createPool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  connectionLimit: 5,
});

module.exports = sql;
