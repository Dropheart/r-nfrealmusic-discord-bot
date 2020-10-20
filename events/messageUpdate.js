const yml = require('yaml')
const fs = require('fs')
const { client } = require('../bot.js')

module.exports = (message, oldMessage, newMessage) => {
    var it = new File(`./servers/${oldMessage.guild.id}.yml`)
    if (!it.exists()) return;
    try { var fsread = fs.readFileSync(`./servers/${oldMessage.guild.id}.yml`, 'utf8')
    var serverconf = yml.parseDocument(fsread).toJSON()
    if (!serverconf.logchannels.messagelogs[0]) return;
    var logchannel = serverconf.logchannels.messagelogs[0]
    console.log(client.channels.fetch(logchannel))
    var d = new Date()
    client.channels.fetch(logchannel).then(
    console.log(client.channels.cache.get(logchannel),
    client.channels.cache.get(channel).send(
        `✏ **${oldMessage.author.username}#${oldMessage.author.discriminator}** (${oldMessage.author.id} / <@${oldMessage.author.id}>) edited their message at **${d}** in <#${oldMessage.channel.id}> (**${oldMessage.channel.name}**, ${oldMessage.channel.id}) \n \`\`\`${oldMessage.content}\`\`\` \`to\` \`\`\`${newMessage.content}\`\`\` \n `
    )))
    } catch (err) {
        console.log(err)
    }
}