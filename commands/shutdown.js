exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    message.channel.send('Shutting down.')
    client.destroy();
}