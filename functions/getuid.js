module.exports = (message, args) => {
    let uid
    try {
        uid = message.mentions.users.first().id
    } catch (err) {
        uid = args[0] 
    }
    return uid
}