const permcheck= require('../functions/permissioncheck.js')
const sql = require('../mariadb.js')
const { MessageEmbed } = require('discord.js')


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'case')
    if (!permission) return;

    let things = await sql.query(`SELECT caseid, reason, victim, moderator, date, type, link FROM \`${message.guild.id}\` WHERE caseid=${args[0]}`)
    
    if (things[0].type === 'Mute') {
        color = '8B0000'
    } else if (things[0].type === 'Ban') {
        color = 'FF0000'
    } else if (things[0].type === 'Unmute') {
        color = '00FF00'
    } else if (things[0].type === 'Unban') {
        color = '00FF00'
    } else if (things[0].type === 'Kick') {
        color = 'FFA500'
    } else if (things[0].type === 'Warn') {
        color = '4A0D00'
    } else if (things[0].type === 'Note') {
        color = '00EAFF'
    }

    let myguy = await client.users.fetch(things[0].victim)
    let mod = await client.users.fetch(things[0].moderator)
    let d = new Date(things[0].date * 1000)

    embed = new MessageEmbed()
    .setTitle(`${things[0].type} - Case #${things[0].caseid}`)
    .setColor(color)
    .addField("Victim", `${myguy.tag}\n<@${myguy.id}>`, true)
    .addField("Moderator", `${mod.tag}\n<@${mod.id}>`, true)
    .addField(`Reason`, things[0].reason, false)
    .addField(`Time`, d, false)

    message.channel.send(embed)

}