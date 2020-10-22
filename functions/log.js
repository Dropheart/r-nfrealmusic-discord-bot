const yml = require('yaml')
const fs = require('fs')


module.exports = (client, logmessage, logged) => {
    if (logged.channel.type == "dm") return;
    if (!fs.existsSync(`./servers/${logged.guild.id}.yml`)) return;
    try { var fsread = fs.readFileSync(`./servers/${logged.guild.id}.yml`, 'utf8')
        var serverconf = yml.parseDocument(fsread).toJSON()
        if (!serverconf.logchannels.messagelogs[0]) return;
        var logchannel = serverconf.logchannels.messagelogs[0]
        console.log(client.channels.fetch(logchannel))
        var d = new Date()
        client.channels.fetch(logchannel).then(
        console.log(client.channels.cache.get(logchannel),
        client.channels.cache.get(logchannel).send(logmessage.replace('{d}', d), {"allowedMentions": { "users" : []}} )))
    } catch (err) {
        console.log(err)
    }
}