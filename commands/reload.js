exports.run = (client, message, args) => {
  const command = args[0];
  if (message.author.id !== client.config.ownerid) return;
  if (!args[0]) {
    return message.channel.send("Maybe give me an argument, numpty.");
  } else if (!client.commands.has(command)) {
    return message.channel.send("That's not a command.");
  }

  delete require.cache[require.resolve(`./${command}.js`)];
  client.commands.delete(command);
  const props = require(`./${command}.js`);
  client.commands.set(command, props);
  message.channel.send(`Command ${command} has been reloaded.`);
};
