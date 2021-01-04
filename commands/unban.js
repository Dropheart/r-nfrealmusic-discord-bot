const permcheck= require('../functions/permissioncheck.js')
const modlog = require('../functions/modlog.js');
const getuid = require('../functions/getuid.js');


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'ban')
    if (!permission) return;

    let myguy
    let uid = getuid(message, args)

    try {
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
        } else if (err.message == 'Missing Permissions') {
            message.channel.send(`🚫 I do not have permission to unban users.`)
            return;
        } else {console.log(err)}
    }

    let reason = args.join(' ')
    
    try {
        canirun(message, true, 'mod') 
        await message.guild.members.unban(uid, reason)
        cid = await modlog(client, message, 'Unban', uid, reason)
        canirun(message, false, 'mod')
        message.channel.send(`✅ ${cid[0]}User ${myguy.tag} has been unbanned. (Case ${cid[1]})`)
    } catch (err) {
        console.log(err)
        console.log(err.message)
        return;
    }
}