exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.ownerid) return;
  code = args.join(" ");
  console.log(code);
  try {
    evald = await eval(code);
    message.channel.send(evald, { code: "xl" });
  } catch (err) {
    message.channel.send("```" + err.message + "```");
  }
};
