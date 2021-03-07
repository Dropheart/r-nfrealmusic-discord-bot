const log = require("../functions/log.js");

module.exports = (client, oldRole, newRole) => {
  log(
    client,
    `❗ **Role has been updated at {d}**\n Permission bitfield: ${oldRole.permissions.bitfield} --> ${newRole.permissions.bitfield}\n Role Name: ${oldRole.name} --> ${newRole.name}`,
    oldRole
  );
};
