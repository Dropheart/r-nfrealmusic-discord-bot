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
        let epoch = Math.floor(new Date().getTime() / 1000)
        var d = new Date()

        let actioned
        if (type === 'Mute') {
            color = '8B0000'
            actioned = 'muted in'
            configured = serverconf.caseDMs.mute
        } else if (type === 'Ban') {
            color = 'FF0000'
            actioned = 'banned from'
            configured = serverconf.caseDMs.ban
        } else if (type === 'Unmute') {
            color = '00FF00'
            actioned = 'unmuted in'
            configured = serverconf.caseDMs.unmute
        } else if (type === 'Unban') {
            color = '00FF00'
        } else if (type === 'Kick') {
            color = 'FFA500'
            actioned = 'kicked from'
            configured = serverconf.caseDMs.kick
        } else if (type === 'Warn') {
            color = '4A0D00'
            actioned = 'warned in'
            configured = serverconf.caseDMs.warn
        } else if (type === 'Note') {
            color = '00EAFF'
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
        
        if (reason.length > 1000) {
            await message.channel.send('Reason too long.')
            return;
        }

        if (!reason) {reason = "No reason provided."}
        let tbs
        let cannot = ''
        if (actioned) {
            tbs = `**You have been ${actioned} ${message.guild.name}. The following information was given regarding it:**\n${configured}`
            tbs = tbs.replace('{r}', reason)
            try {
                await myguy.send(tbs)
            } catch (err) {
                if (err.message != "Cannot send messages to this user") {
                    console.log(err.message)
                }
                reason = `[Could not message user] ${reason}`
                cannot = '[Could not message user] '

            }
        }


        myguy = await client.users.fetch(victim)
        embed = new MessageEmbed()
        .setTitle(`${type} - Case #${caseid}`)
        .setColor(color)
        .addField("Victim", `${myguy.tag}\n<@${myguy.id}>`, true)
        .addField("Moderator", `${message.member.user.tag}\n<@${message.member.user.id}>`, true)
        .addField(`Reason`, reason, false)
        .addField(`Time`, d, false)
        
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

        return [cannot, caseid]
        
    } catch (err) {
        console.log(err)
        console.log(err.message)
    }
}