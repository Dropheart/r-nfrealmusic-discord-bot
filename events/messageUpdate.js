const log = require('../functions/log.js')

module.exports = (client, oldMessage, newMessage) => {
    log(client, `✏ **${oldMessage.author.username}#${oldMessage.author.discriminator}** (${oldMessage.author.id} / <@${oldMessage.author.id}>) edited their message at **{d}** in <#${oldMessage.channel.id}> (**${oldMessage.channel.name}**, ${oldMessage.channel.id}) \`\`\`${oldMessage.content}\`\`\` to \`\`\`${newMessage.content}\`\`\` \n `, oldMessage)
}