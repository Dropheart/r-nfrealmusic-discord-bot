const permcheck = require("../functions/permissioncheck.js");
const sql = require("../mariadb.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  var permission = permcheck(client, message, message.member, "case");
  if (!permission) return;

  let things = await sql.query(
    `SELECT caseid, reason, victim, moderator, date, type, link FROM \`${message.guild.id}\` WHERE caseid=?`,
    [args[0]]
  );

  regex = things[0].link.match(/([0-9]+)/g);
  msgid = regex[2];
  logchannel = regex[1];

  try {
    chanl = await client.channels.fetch(logchannel);
    mesag = await client.channels.cache.get(logchannel).messages.fetch(msgid);
  } catch (err) {
    console.log(err);
  }

  message.channel.send(mesag.embeds[0]);
};
