const permcheck= require('../functions/permissioncheck.js')
const modlog = require('../functions/modlog.js')


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'kick')
    if (!permission) return;

    let uid
    try {
        uid = args[0]
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
    if (permcheck(client, message, message.guild.member(uid)) >= permcheck(client, message, message.member)) {
        message.channel.send("🚫 You do not have permission to warn that user.")
        return;
    }
    let reason = args.join(' ')

    try {
        cid = await modlog(client, message, 'Warn', uid, reason)
        message.channel.send(`‼ ${cid[0]}User **${myguy.tag}** has been warned. (Case ${cid[1]})`)
    } catch (err) {
        console.log(err)
        console.log(err.messaage)
        return;
    }

}