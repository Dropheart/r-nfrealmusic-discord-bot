const log = require('../functions/log.js')

module.exports = (client, oldChannel, newChannel) => {
    if (oldChannel.position != newChannel.position || oldChannel.rawPosition != newChannel.rawPosition) return;
    if (!oldChannel.topic) {var oldtopic = "[ No topic ]"} else {oldtopic = oldChannel.topic}
    if (!newChannel.topic) {var newtopic = "[ No topic ]"} else {newtopic = newChannel.topic}
    log(client, `🔃 **Channel ${newChannel} has been updated**. For more information, check the audit logs.\n 
    Channel name: ${oldChannel.name} --> ${newChannel.name}\n 
    Channel Topic: ${oldtopic} --> ${newtopic}`
    , oldChannel)
}