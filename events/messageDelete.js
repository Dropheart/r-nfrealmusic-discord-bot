const log = require("../functions/log.js");

module.exports = (client, message) => {
  log(
    client,
    `🗑 **${message.author.username}#${message.author.discriminator}** (${message.author.id} / <@${message.author.id}>) deleted their message (${message.id}) at **{d}** in <#${message.channel.id}> (**${message.channel.name}**, ${message.channel.id}) \`\`\`${message.content}\`\`\` `,
    message
  );
};
