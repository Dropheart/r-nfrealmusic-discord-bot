exports.run = (client, message, args) => {
  if (message.author.id !== client.config.ownerid) return;
  activity = args.join(" ").split(" - ");
  try {
    console.log(activity[0], activity[1].toUpperCase());
    activitytype = activity[1].toUpperCase();
    client.user.setActivity(activity[0], { type: String(activitytype) });
    message.channel.send("Activity has been set to `" + activity[0] + "`.");
  } catch {
    client.user.setActivity(activity[0]);
    message.channel.send("Activity has been set to `" + activity[0] + "`.");
  }
};
