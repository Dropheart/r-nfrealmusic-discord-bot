const permcheck= require('../functions/permissioncheck.js')
const getuid = require('../functions/getuid.js')


exports.run = async (client, message, args) => {
    if (args[0]) {
        uid = getuid(message, args)
        name = await client.users.fetch(uid)
        gmember = await message.guild.member(uid) 
        message.channel.send(`**${name.tag}**'s permission level is: **${permcheck(client, message, gmember)}**`)
    } else {
        message.channel.send(`Your permission level is: **${permcheck(client, message, message.member)}**`)
    }

}