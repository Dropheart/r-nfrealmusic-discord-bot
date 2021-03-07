const { User } = require("discord.js");

exports.run = (client, message, args) => {
  if (!args[0]) {
    message.channel.send(
      message.author.displayAvatarURL({ dynamic: true, size: 1024 })
    );
  } else {
    try {
      theirid = args[0];
      if (args[0]) {
        if (typeof args[0] == "number") {
          args[0] = theirid;
          console.log(theirid);
        } else if (args[0].startsWith("<@!")) {
          theirid = args[0].slice(3, -1);
        } else if (args[0].startsWith("<@")) {
          theirid = args[0].slice(2, -1);
        }
      }
      person = client.users.cache.get(theirid);
      message.channel.send(
        person.displayAvatarURL({ dynamic: true, size: 1024 })
      );
    } catch (err) {
      console.log(err);
    }
  }
};
