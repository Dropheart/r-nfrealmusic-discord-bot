const fs = require("fs");
const sql = require("../mariadb.js");
const config = require("../config.json");

module.exports = (client, guild) => {
  fs.open(`./servers/${guild.id}.yml`, "w", function (err) {
    if (err) console.log(err);
    console.log(`Joined ${guild.name} / ${guild.id}`);
  });
  fs.open(`./timers/mutes/${guild.id}.yml`, "w", function (err) {
    if (err) console.log(err);
  });

  async function f() {
    try {
      res = await sql.query(
        `CREATE TABLE \`${guild.id}\` (caseid INT NOT NULL, reason TEXT NULL DEFAULT NULL, updates JSON NULL DEFAULT NULL, victim VARCHAR(19) NULL DEFAULT NULL, moderator VARCHAR(19) NULL DEFAULT NULL, date INT NULL DEFAULT NULL, type TINYTEXT NULL DEFAULT NULL, link TINYTEXT NULL DEFAULT NULL);`
      );
    } catch (err) {
      console.log(err);
    }
  }

  f();
};
