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

    let reason = args.join(' ')

    try {
        await message.guild.member(uid).kick(reason)
        message.channel.send(`👢 User **${myguy.tag}** has been kicked.`)
        modlog(client, message, 'Kick', uid, reason)
    } catch (err) {
        console.log(err)
        console.log(err.messaage)
        return;
    }

}