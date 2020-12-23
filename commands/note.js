const permcheck= require('../functions/permissioncheck.js')
const modlog = require('../functions/modlog.js');
const getuid = require('../functions/getuid.js');


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'note')
    if (!permission) return;

    let uid = getuid(message, args)
    args = args.splice(1)
    console.log(args)
    myguy = await client.users.fetch(uid)
    
    let reason = args.join(' ')

    try {
        cid = await modlog(client, message, 'Note', uid, reason)
        message.channel.send(`‼ ${cid[0]}Added a note on **${myguy.tag}**. (Case ${cid[1]})`)
    } catch (err) {
        console.log(err)
        console.log(err.messaage)
        return;
    }

}