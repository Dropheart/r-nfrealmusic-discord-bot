const permcheck= require('../functions/permissioncheck.js')


exports.run = (client, message, args) => {
    message.channel.send(`Your permission level is: **${permcheck(client, message, message.member)}**`)
}