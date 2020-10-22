const log = require('../functions/log.js')

module.exports = (client, channel) => {
    log(client, `🆕 New channel <#${channel.id}> (**${channel.name}**, ${channel.id}) created at **{d}**`, channel)
}