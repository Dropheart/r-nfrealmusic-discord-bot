const permcheck= require('../functions/permissioncheck.js')
const yml = require('yaml')
const fs = require('fs')


exports.run = (client, message, args) => {
    var permission = permcheck(client, message, 'mute')
    if (!permission) return;

    try { var fsread = fs.readFileSync(`./servers/${message.guild.id}.yml`, 'utf8')
    var serverconf = yml.parseDocument(fsread).toJSON()
    var muterole = serverconf.muteRole
    } catch (err) {
        console.log(err)
    }

    try {
        var uid = args[0]
        args = args.splice(1)
        mutereason = args.join(' ')
        member = message.guild.member(uid).user.tag 
        message.guild.member(uid).roles.remove(muterole, mutereason).then(message.channel.send(`User **${member}** has been unmuted.`))
    } catch(err) {
        console.log(err)
        message.channel.send("Ensure your message is in the format `unmute userid (reason)`")
    }

}