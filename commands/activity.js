exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    tobeset = args[0]
    client.user.setActivity(tobeset); 
}