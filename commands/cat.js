const r2 = require('r2')
const tiny = require('tiny-json-http')

exports.run = (client, message, args) => {
    link = "https://api.thecatapi.com/v1/images/search?api_key=" + client.config.catapikey 
    const cat = tiny.get({link}, _get(result));
    message.channel.send(cat.url);
}