const permcheck = require("../functions/permissioncheck.js");
const sql = require("../mariadb.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  var permission = permcheck(client, message, message.member, "update");
  if (!permission) return;

  caseid = args[0];
  let things = await sql.query(
    `SELECT caseid, reason, updates, victim, moderator, date, type, link FROM \`${message.guild.id}\` WHERE caseid=?`,
    [caseid]
  );
  if (!things[0]) {
    message.channel.send("❓ No case exists with this number.");
    return;
  }

  if (!args[1]) {
    message.channel.send(
      "❓ Please give me something to update the case with."
    );
    return;
  }

  regex = things[0].link.match(/([0-9]+)/g);
  msgid = regex[2];
  logchannel = regex[1];

  tbr = args.splice(1).join(" ");
  if (things[0].updates) {
    console.log(things[0].updates);
    pleasework = things[0].updates;
    pleasework.push(`${tbr}`);
    pleasework = JSON.stringify(pleasework);
  } else {
    pleasework = [`${tbr}`];
    pleasework = JSON.stringify(pleasework);
  }
  try {
    chanl = await client.channels.fetch(logchannel);
    mesag = await client.channels.cache.get(logchannel).messages.fetch(msgid);
  } catch (err) {
    console.log(err);
  }

  ogembed = await mesag.embeds[0];
  embed = mesag.embeds[0];
  embed.addField(`${message.author.tag} @ ${new Date()}`, tbr, false);

  try {
    mesag.edit(embed);
  } catch (err) {
    console.log(err);
    message.channel.send(
      `I cannot update the embed and thus cannot update the case. Ensure that I have permission to send messages in <#${logchannel}>, and that your updates aren't too long.`
    );
    return;
  }

  try {
    await sql.query(
      `UPDATE \`${message.guild.id}\` SET updates = ? WHERE caseid=?`,
      [pleasework, caseid]
    );
  } catch (err) {
    mesag.edit(ogembed);
    console.log(err);
    return;
  }
  message.channel.send("✔ Case has been updated.");
};
