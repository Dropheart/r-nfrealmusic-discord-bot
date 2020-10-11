exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    command = '!activity'
    tobeset = String(message.content.slice(command.length))
    client.user.setActivity(tobeset);
    message.channel.send("Activity has been set to `" + tobeset + "`.") 
}