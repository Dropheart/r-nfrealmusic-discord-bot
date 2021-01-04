const permcheck= require('../functions/permissioncheck.js');
const sql = require('../mariadb.js');
const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'update')
    if (!permission) return;

    caseid = args[0]
    let things = await sql.query(`SELECT caseid, reason, victim, moderator, date, type, link FROM \`${message.guild.id}\` WHERE caseid=${caseid}`)
    if (!things[0]) {
        message.channel.send('❓ No case exists with this number.')
        return;
    }  
    
    if (!args[1]) {
        message.channel.send('❓ Please give me something to update the case with.')
        return;
    }
    let reason = things[0].reason
    regex = things[0].link.match(/([0-9]+)/g)
    msgid = regex[2]
    logchannel = regex[1]

    tbr = args.splice(1).join(' ')
    reason = `${reason}\n\n[Update] from **${message.author.tag}** @ **${new Date()}**:\n ${tbr}`
    await sql.query(`UPDATE \`${message.guild.id}\` SET reason = '${reason}' WHERE caseid=${caseid}`)

    try { 
        chanl = await client.channels.fetch(logchannel) 
        mesag = await client.channels.cache.get(logchannel).messages.fetch(msgid)
    } catch (err) {
        console.log(err)
    }


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
    .addField(`Reason`, reason, false)
    .addField(`Time`, d, false)

    try {
        mesag.edit(embed)
    } catch (err) {
        console.log(err)
    }

    message.channel.send('✔ Case has been updated.')

}