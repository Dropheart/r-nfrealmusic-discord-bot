const log = require('../functions/log.js')

module.exports = (client, oldMessage, newMessage) => {
    if (oldMessage.content == newMessage.content && oldMessage.embeds != newMessage.embeds) return;
    log(client, `✏ **${oldMessage.author.username}#${oldMessage.author.discriminator}** (${oldMessage.author.id} / <@${oldMessage.author.id}>) edited their message (${oldMessage.id}) at **{d}** in <#${oldMessage.channel.id}> (**${oldMessage.channel.name}**, ${oldMessage.channel.id}) \`\`\`${oldMessage.content}\`\`\` to \`\`\`${newMessage.content}\`\`\` \n `, oldMessage)
}