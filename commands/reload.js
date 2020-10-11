exports.run = (client, message, args) => {
    const command = args[0]

    if (!client.commands.has(command)) {
        return message.channel.send("That's not a command.")
    }
    
    delete require.cache[require.resolve(`./${command}.js`)];
    client.commands.delete(command);
    const props = require(`./${command}.js`);
    client.commands.set(command, props);
    message.channel.send(`Command ${command} has been reloaded.`);
}