const permcheck= require('../functions/permissioncheck.js')
const yml = require('yaml')
const jsyml = require('js-yaml')
const fs = require('fs')
const modlog = require('../functions/modlog.js')
const getuid = require('../functions/getuid.js')

exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'mute')
    if (!permission) return;

    try { var fsread = fs.readFileSync(`./servers/${message.guild.id}.yml`, 'utf8')
        var serverconf = yml.parseDocument(fsread).toJSON()
        var muterole = serverconf.muteRole
    } catch (err) {
        message.channel.send("Configure a mute role.")
        return;
    }
    
    let uid = getuid(message, args)
    try {
        await message.guild.member(uid).fetch()
        if (message.guild.member(uid).roles.cache.keyArray().includes(muterole)) {
            message.channel.send(`**${message.guild.member(uid).user.tag}** is already muted.`)
            return;
        }
        args = args.splice(1)
        if (permcheck(client, message, message.guild.member(uid)) >= permcheck(client, message, message.member)) {
            message.channel.send("🚫 You do not have permission to mute that user.")
            return;
        }
    } catch (err) {
        if (err.message == 'Cannot read property \'fetch\' of null') {
            message.channel.send(`❓ This user is not on this server. Double check your provided ID.`)
        } else {
        message.channel.send("Ensure your message is formatted as such: `mute userid (time) (reason)`")
        }
        return;
    }



    try {
        if (args[0].match(/^(\d).*([smhdy])$/g)) {
            var time = args[0]
            args = args.splice(1)  
            
            if (time.endsWith("h")) {
                var epoch = parseInt(Math.floor(new Date() / 1000)) + parseInt(time.slice(0, -1))*360
                time = time.slice(0, -1) + " hour(s)"
            } else if (time.endsWith("s")) {
                var epoch = parseInt(Math.floor(new Date() / 1000)) + parseInt(time.slice(0, -1)) 
                time = time.slice(0, -1) + " second(s)"
            } else if (time.endsWith("m")) {
                var epoch = parseInt(Math.floor(new Date() / 1000)) + parseInt(time.slice(0, -1))*60 
                time = time.slice(0, -1) + " minute(s)"
            } else if (time.endsWith("d")) {
                var epoch = parseInt(Math.floor(new Date() / 1000)) + parseInt(time.slice(0, -1))*8640
                time = time.slice(0, -1) + " day(s)"
            } else if (time.endsWith("y")) {
                var epoch = parseInt(Math.floor(new Date() / 1000)) + parseInt(time.slice(0, -1))*3153600
                time = time.slice(0, -1) + " year(s)"
            }
            
            let fsread = fs.readFileSync(`./timers/mutes/${message.guild.id}.yml`, 'utf8')
            let data = {
                [uid]: epoch
            }
            let tbr = jsyml.safeDump(data)
            
            fs.appendFileSync(`./timers/mutes/${message.guild.id}.yml`, tbr, 'utf8')
        }
        if (time) {
            mutereason = args.join(' ')
            member = message.guild.member(uid).user.tag 
            logreason = `[Muted for ${time}] ` + mutereason 
            try {
                await message.guild.member(uid).roles.add(muterole, mutereason)   
                cid = await modlog(client, message, 'Mute', uid, logreason)
                message.channel.send(`🤐 ${cid[0]}User **${member}** has been muted for ${time}. (Case ${cid[1]})`)
            } catch (err) {
                message.channel.send("🚫 I do not have permission to assign the mute role.")
            }
        } else {
            throw(err)
        }

        
    } catch(err) {
        mutereason = args.join(' ')
        member = message.guild.member(uid).user.tag 
        console.log(err)   
        try {
            await message.guild.member(uid).roles.add(muterole, mutereason)
            cid = await modlog(client, message, 'Mute', uid, mutereason)
            message.channel.send(`🤐 ${cid[0]}User **${member}** has been muted indefinitely. (Case ${cid[1]})`)
        } catch (err) {
            message.channel.send("🚫 I do not have permission to assign the mute role.")
        }
        return;
    }
}