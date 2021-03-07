const yml = require("yaml");
const fs = require("fs");

module.exports = (client, message, user, command) => {
  if (message.channel && message.channel.type == "dm") return;
  if (!fs.existsSync(`./servers/${message.guild.id}.yml`)) return;
  try {
    var fsread = fs.readFileSync(`./servers/${message.guild.id}.yml`, "utf8");
    var serverconf = yml.parseDocument(fsread).toJSON();
    var roles = user.roles.cache.keyArray();
    // console.log(user.roles.cache.keyArray())
    var perms = 0;
    // console.log(Object.entries(serverconf.rolePermissions))
    for (var [key, value] of Object.entries(serverconf.rolePermissions)) {
      // console.log(`${key} and ${value}`)
      // console.log(roles.includes(key))
      if (roles.includes(key) && value > perms) {
        var perms = value;
      }
    }
  } catch (err) {
    console.log(err);
  }

  if (command !== null) {
    if (!serverconf.commandPermissions) return;
    var permLevel = serverconf.commandPermissions[command];
    // console.log(permLevel)
  }

  if (!command) {
    return perms;
  } else if (permLevel <= perms) {
    return true;
  } else {
    return false;
  }
};
