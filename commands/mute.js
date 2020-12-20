const permcheck= require('../functions/permissioncheck.js')
const yml = require('yaml')
const jsyml = require('js-yaml')
const fs = require('fs')
const modlog = require('../functions/modlog.js')

exports.run = (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'mute')
    if (!permission) return;

    try { var fsread = fs.readFileSync(`./servers/${message.guild.id}.yml`, 'utf8')
        var serverconf = yml.parseDocument(fsread).toJSON()
        var muterole = serverconf.muteRole
    } catch (err) {
        message.channel.send("Configure a mute role.")
        return;
    }

    try {
        var uid = args[0]
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
        message.channel.send("Ensure your message is formatted as such: `mute userid (time) (reason)")
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
                modlog(client, message, 'Mute', uid, logreason)
                message.guild.member(uid).roles.add(muterole, mutereason).then(message.channel.send(`User **${member}** has been muted for ${time}.`))    
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
            modlog(client, message, 'Mute', uid, mutereason)
            message.guild.member(uid).roles.add(muterole, mutereason).then(message.channel.send(`User **${member}** has been muted indefinitely.`))
        } catch (err) {
            message.channel.send("🚫 I do not have permission to assign the mute role.")
        }
        return;
    }
}