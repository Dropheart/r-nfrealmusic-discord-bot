const permcheck= require('../functions/permissioncheck.js')
const modlog = require('../functions/modlog.js')


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'ban')
    if (!permission) return;

    let uid
    let banned
    try {
        uid = args[0]
        args = args.splice(1)
        console.log(args)
        myguy = await client.users.fetch(uid)
        await message.guild.fetchBan(uid)
        message.channel.send(`🚫 This user is already banned.`)
        return;
    } catch (err) {
        if (err.message == 'Unknown Ban') {
            banned = false
        } else if (err.message == 'Unknown User') {
            message.channel.send(`❓ This user does not exist.`)
            return;
        }
        else {
            console.log(err)
        }
    }

    let days = 0
    if (args[0] == '-d') {
        if (args[1] <= 7) {
            days = args[1]
            args = args.splice(2)
        } else {
            message.channel.send("❓ You can only delete up to 7 days of their message history.")
        }
    }

    let reason = args.join(' ')

    try {
        await message.guild.members.ban(uid, { days: days, reason: reason})
        message.channel.send(`🔨 User **${myguy.tag}** has been banned.`)
        modlog(client, message, 'Ban', uid, reason)
    } catch (err) {
        console.log(err)
        console.log(err.messaage)
        return;
    }
}