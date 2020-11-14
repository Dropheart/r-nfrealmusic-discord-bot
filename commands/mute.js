const permcheck= require('../functions/permissioncheck.js')
const yml = require('yaml')
const fs = require('fs')


exports.run = (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'mute')
    if (!permission) return;

    var uid = args[0]
    args = args.splice(1)
    if (permcheck(client, message, message.guild.member(uid)) >= permcheck(client, message, message.member)) {
        message.channel.send("🚫 You do not have permission to mute that user.")
        return;
    }

    try { var fsread = fs.readFileSync(`./servers/${message.guild.id}.yml`, 'utf8')
    var serverconf = yml.parseDocument(fsread).toJSON()
    var muterole = serverconf.muteRole
    } catch (err) {
        console.log(err)
    }

    try {
        if (args[0].match(/^(\d).*([smhdy])$/g)) {
            var time = args[0]
            args = args.splice(1)  
            
            if (time.endsWith("h")) {
                time = time.slice(0, -1) + " hour(s)"
            } else if (time.endsWith("s")) {
                time = time.slice(0, -1) + " second(s)"
            } else if (time.endsWith("m")) {
                time = time.slice(0, -1) + " minute(s)"
            } else if (time.endsWith("d")) {
                time = time.slice(0, -1) + " day(s)"
            } else if (time.endsWith("y")) {
                time = time.slice(0, -1) + " year(s)"
            }
        }
        mutereason = args.join(' ')
        member = message.guild.member(uid).user.tag 

        message.guild.member(uid).roles.add(muterole, mutereason).then(message.channel.send(`User **${member}** has been muted for **${time}**.`))
    } catch(err) {
        console.log(err)
        message.channel.send("Ensure your message is in the format `mute userid time[m/h/d] reason`")
    }

}