
exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    code = args[0]

    message.channel.send(eval(code), {code:"xl"}); 
}