const log = require('../functions/log.js')

module.exports = (client, role) => {
    log(client, `🗑 Role **${role.name}** has been deleted at **d**, with the permission bitfield **${role.permissions.bitfield}**`, role)
}
