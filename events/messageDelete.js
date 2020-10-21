const yml = require('yaml')
const fs = require('fs')
const { client } = require('../bot.js')
var util = require('util')

module.exports = (client, message) => {
    if (!fs.existsSync(`./servers/${message.guild.id}.yml`)) return;
    try { var fsread = fs.readFileSync(`./servers/${message.guild.id}.yml`, 'utf8')
        var serverconf = yml.parseDocument(fsread).toJSON()
        if (!serverconf.logchannels.messagelogs[0]) return;
        var logchannel = serverconf.logchannels.messagelogs[0]
        var d = new Date()
        client.channels.fetch(logchannel).then(
            console.log(client.channels.cache.get(logchannel),
            client.channels.cache.get(logchannel).send(
            `🗑 **${message.author.username}#${message.author.discriminator}** (${message.author.id} / <@${message.author.id}>) deleted their message at **${d}** in <#${message.channel.id}> (**${message.channel.name}**, ${message.channel.id}) \`\`\`${message.content}\`\`\` `, {"allowedMentions": { "users" : []}}
        )))
    } catch (err) {
        console.log(err)
    }
}