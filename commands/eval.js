
exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerid) return;
    code = args.join(' ')
    console.log(code)
    message.channel.send(eval(code), {code:"xl"}); 
}