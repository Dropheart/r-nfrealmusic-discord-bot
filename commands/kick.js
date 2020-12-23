const permcheck= require('../functions/permissioncheck.js')
const modlog = require('../functions/modlog.js');
const getuid = require('../functions/getuid.js');


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'kick')
    if (!permission) return;

    let uid = getuid(message, args)
    try {
        args = args.splice(1)
        console.log(args)
        await message.guild.member(uid).fetch()
        myguy = await client.users.fetch(uid)
    } catch (err) {
        if (err.message == 'Cannot read property \'fetch\' of null') {
            message.channel.send(`❓ This user is not on this server. Double check your provided ID.`)
            return;
        }
        else {
            console.log(err.message)
        }    
    }

    kickable = await message.guild.member(uid).kickable
    if (!kickable) {
        message.channel.send(`❌ I do not have permission to kick this member.`)
        return;
    }

    let reason = args.join(' ')
    if (permcheck(client, message, message.guild.member(uid)) >= permcheck(client, message, message.member)) {
        message.channel.send("🚫 You do not have permission to kick that user.")
        return;
    }
    try {
        cid = await modlog(client, message, 'Kick', uid, reason)
        await message.guild.member(uid).kick(reason)
        message.channel.send(`👢 ${cid[0]}User **${myguy.tag}** has been kicked. (Case ${cid[1]})`)
    } catch (err) {
        console.log(err)
        console.log(err.messaage)
        return;
    }

}