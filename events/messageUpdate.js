const yml = require('yaml')
const fs = require('fs')

module.exports = (oldMessage, newMessage) => {
    
    try { var fsread = fs.readFileSync(`./servers/${newMessage.guild.id}.yml`, 'utf8')
    console.log(fsread)
    var serverconf = yml.parseDocument(fsread)
    console.log(serverconf)
    var logchannel = serverconf.messagelogs

    newMessage.logchannel.send(oldMessage + "has been changed to" + newMessage) } catch (err) {
        console.log(err)
    }
}