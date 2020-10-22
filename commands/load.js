exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    const command = args[0]

    if (client.commands.has(command)) {
        message.channel.send("Did you mean to use !reload?")
    }
    
    const props = require(`./${command}.js`);
    client.commands.set(command, props);
    message.channel.send(`Command ${command} has been loaded.`);
}