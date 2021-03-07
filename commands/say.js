exports.run = (client, message, args) => {
  if (message.author.id !== client.config.ownerid) return;
  message.delete();
  message.channel.send(args.join(" "));
};
