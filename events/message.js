const Discord = require('discord.js')
canido = require('../functions/ratelimits.js')

module.exports = (client, message) => {
    if (message.author.bot || message.content.indexOf(client.config.prefix) !== 0) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command == 'ban' || command == 'unban' || command == 'kick' || command == 'warn' || command == 'note' || command == 'mute' || command == 'unmute') {
        can = canido(message, false, 'msgevent')
        if (can) return;
    }
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
};