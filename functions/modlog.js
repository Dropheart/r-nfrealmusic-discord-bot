const yml = require('yaml')
const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const sql = require('../mariadb.js')

module.exports = async (client, message, type, victim, reason) => {
    if (!fs.existsSync(`./servers/${message.guild.id}.yml`)) return;
    try { var fsread = fs.readFileSync(`./servers/${message.guild.id}.yml`, 'utf8')
        var serverconf = yml.parseDocument(fsread).toJSON()
        if (!serverconf.logchannels.modlogs[0]) return;
        var logchannel = serverconf.logchannels.modlogs[0]
        var d = new Date()
        let epoch = Math.floor(new Date().getTime() / 1000)
        if (type === 'Mute') {
            color = '8B0000'
        } else if (type === 'Ban') {
            color = 'FF0000'
        } else if (type === 'Unban' || 'Unmute') {
            color = '00FF00'
        } else if (type === 'Kick') {
            color = 'FFA500'
        }

        let embed
        let caseid
        try {
            caseid = await sql.query(`SELECT MAX(caseid) FROM \`${message.guild.id}\``);
            caseid = caseid[0]['MAX(caseid)']
            if (caseid) {
                caseid++
                console.log(caseid)
            } else {
                caseid = 1
                console.log(caseid)
            }             
        } catch (err) {
            console.log(err)
        }

        if (!reason) {reason = "No reason provided."}
        
        nerd = await client.users.fetch(victim)
        embed = new MessageEmbed()
        .setTitle(`${type} - Case #${caseid}`)
        .setColor(color)
        .addField("Victim", `${nerd.tag}\n<@${nerd.id}>`, true)
        .addField("Moderator", `${message.member.user.tag}\n<@${message.member.user.id}>`, true)
        .addField(`${message.member.user.tag} @ ${d}`, reason, false)

        let msglink
        let mod = message.member.user.id

        await client.channels.fetch(logchannel)
        message = await client.channels.cache.get(logchannel).send(embed)
        msglink = message.url

        try {
            await sql.query(`INSERT INTO \`${message.guild.id}\` VALUES (${caseid}, '${reason}', ${victim}, ${mod}, ${epoch}, '${type}', '${msglink}');`)
        } catch (err) {
            console.log(err)
        }

        



    } catch (err) {
        console.log(err)
    }
}