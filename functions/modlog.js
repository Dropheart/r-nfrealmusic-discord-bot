const yml = require('yaml')
const fs = require('fs')
const jsyml = require('js-yaml')
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
            color = 'D3D3D3'
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

        embed = new MessageEmbed()
        .setTitle(`${type} - Case #${caseid}`)
        .setColor(color)
        .addField("Victim", `${message.guild.member(victim).user.tag}\n<@${message.guild.member(victim).user.id}>`, true)
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