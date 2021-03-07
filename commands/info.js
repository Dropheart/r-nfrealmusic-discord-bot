const permcheck = require("../functions/permissioncheck.js");
const sql = require("../mariadb.js");
const { MessageEmbed } = require("discord.js");
const getuid = require("../functions/getuid.js");

exports.run = async (client, message, args) => {
  var permission = permcheck(client, message, message.member, "info");
  if (!permission) return;

  let uid = getuid(message, args);
  let things = await sql.query(
    `SELECT caseid, reason, victim, moderator, date, type, link FROM \`${message.guild.id}\` WHERE victim=${uid}`
  );
  let guildguy;

  things = things.splice(0).reverse();
  let case1 = 0;
  let case2 = 0;
  let case3 = 0;
  let case1url;
  let case2url;
  let case3url;
  let total = 0;

  for (z in things) {
    let x = Object.values(things[z])[0];
    let y = Object.values(things[z])[6];
    total++;
    if (x > case1) {
      case1 = x;
      case1url = y;
    } else if (x > case2) {
      case2 = x;
      case2url = y;
    } else if (x > case3) {
      case3 = x;
      case3url = y;
    }
  }

  let myguy = await client.users.fetch(uid);
  guildguy = await message.guild.member(uid);

  function since(x) {
    let seconds = Math.floor(new Date().getTime() / 1000) - x;
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(days / 31);
    let years = Math.floor(months / 12);
    let time;

    if (seconds < 60) {
      time = `**${seconds}** seconds ago`;
    } else if (minutes < 60) {
      time = `**${minutes}** minutes and **${
        seconds - minutes * 60
      }** seconds ago`;
    } else if (hours < 24) {
      time = `**${hours}** hours and **${minutes - hours * 60}** minutes ago`;
    } else if (days < 7) {
      time = `**${days}** days and **${hours - days * 24}** hours ago`;
    } else if (days < 31) {
      time = `**${weeks}** weeks and **${days - weeks * 7}** days ago`;
    } else if (months < 12) {
      time = `**${months}** months and **${weeks - months * 4}** weeks ago`;
    } else {
      time = `**${years}** years and **${months - years * 12}** months ago`;
    }
    return time;
  }

  time = since(Math.floor(myguy.createdTimestamp / 1000));

  embed = new MessageEmbed()
    .setAuthor(myguy.tag, myguy.displayAvatarURL())
    .setColor("FFB6C1")
    .addField(
      `**User Information**`,
      `Name: **${myguy.tag}**
    ID: \`${myguy.id}\`
    Created: ${time} (\`${myguy.createdAt}\`)
    `
    );

  if (guildguy) {
    let x = guildguy.roles.cache.keyArray();
    x = "<@&" + x.join("> <@&") + ">";

    joined = since(Math.floor(guildguy.joinedTimestamp / 1000));

    let lmg = `_No messages sent since last bot restart_`;
    let nick = `_No nickname set_`;
    if (guildguy.lastMessage) {
      lmg = `${since(
        Math.floor(guildguy.lastMessage.createdTimestamp / 1000)
      )} (\`${guildguy.lastMessage.createdAt}\`)`;
    }
    if (guildguy.nickname) {
      nick = guildguy.nickname;
    }
    embed.addField(
      `**Member Information**`,
      `Nickname: **${nick}**
        Joined: ${joined} (\`${guildguy.joinedAt}\`)
        Roles: ${x}
        Last Message: ${lmg}
        `
    );
  }

  if (case1 > 0 && case2 > 0 && case3 > 0) {
    embed.addField(
      `**Cases**`,
      `**Total cases**: ${total}
        **Last 3 cases**: [#${case1}](${case1url}), [#${case2}](${case2url}), [#${case3}](${case3url})
        `
    );
  } else if (case1 > 0 && case2 > 0) {
    embed.addField(
      `**Cases**`,
      `**Total cases**: ${total}
        **Last 2 cases**: [#${case1}](${case1url}), [#${case2}](${case2url})
        `
    );
  } else if (case1 > 0) {
    embed.addField(
      `**Cases**`,
      `**Total cases**: ${total}
        **Last case**: [#${case1}](${case1url})
        `
    );
  }

  message.channel.send(embed);
};
