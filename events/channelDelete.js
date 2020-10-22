const log = require('../functions/log.js')

module.exports = (client, channel) => {
    log(client, `🗑 Channel #**${channel.name}** (${channel.id}) deleted at **{d}**`, channel)
}