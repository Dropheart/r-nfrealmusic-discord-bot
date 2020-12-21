const permcheck= require('../functions/permissioncheck.js')
const modlog = require('../functions/modlog.js')


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'ban')
    if (!permission) return;

    let myguy
    try {
        uid = args[0]
        myguy = await client.users.fetch(uid)
        args = args.splice(1)
        console.log(args)
        await message.guild.fetchBan(uid)
    } catch (err) {
        if (err.message == 'Unknown Ban') {
            banned = false
            message.channel.send(`❓ User **${myguy.tag}** is not banned.`)
            return;
        } else if (err.message == 'Unknown User') {
            message.channel.send(`❓ This user does not exist.`)
            return;
        } else {console.log(err)}
    }

    let reason = args.join(' ')

    try {
        await message.guild.members.unban(uid, reason)
        message.channel.send(`✅ User ${myguy.tag} has been unbanned.`)
        modlog(client, message, 'Unban', uid, reason)
    } catch (err) {
        console.log(err)
        console.log(err.message)
        return;
    }
}