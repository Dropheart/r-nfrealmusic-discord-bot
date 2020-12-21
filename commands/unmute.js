const permcheck= require('../functions/permissioncheck.js')
const yml = require('yaml')
const fs = require('fs')
const modlog = require('../functions/modlog.js')


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

    try {
        var uid = args[0]
        await message.guild.member(uid).fetch()
        if (!message.guild.member(uid).roles.cache.keyArray().includes(muterole)) {
            message.channel.send(`**${message.guild.member(uid).user.tag}** is already unmuted.`)
            return;
        }
        args = args.splice(1)
        if (permcheck(client, message, message.guild.member(uid)) >= permcheck(client, message, message.member)) {
            message.channel.send("🚫 You do not have permission to unmute that user.")
            return;
        }
    } catch (err) {
        if (err.message == 'Cannot read property \'fetch\' of null' && uid) {
            message.channel.send(`❓ This user is not on this server. Double check your provided ID.`)
        } else {
            message.channel.send("Please supply a user ID.")
        }
        return;
    }

    try {
        mutereason = args.join(' ')
        member = message.guild.member(uid).user.tag
        let fsread = fs.readFileSync(`./timers/mutes/${message.guild.id}.yml`, 'utf8')
        let regex = new RegExp("'" + uid + "': \\d{10,11}\\n", "g") 
        let newData = fsread.replace(regex, '')
        fs.writeFileSync(`./timers/mutes/${message.guild.id}.yml`, newData, 'utf8')
        message.guild.member(uid).roles.remove(muterole, mutereason).then(message.channel.send(`User **${member}** has been unmuted.`))
        modlog(client, message, 'Unmute', uid, mutereason)
    } catch(err) {
        console.log(err)
        message.channel.send("Ensure your message is in the format `unmute userid (reason)`")
    }

}