var http = require("urllib")

exports.run = (client, message, args) => {
    link = "https://api.thecatapi.com/v1/images/search?api_key=" + client.config.catapikey 
    http.request(link, function(err, data, res) {
        if(err) {
            message.channel.send(err);
        }
        const catty = data.toString().slice(1, data.length-1) // this is needed to make it work. don't ask me why. cat.url doesn't work without it, i'm assuming it doesn't see it as a proper json? object?

        // message.channel.send(catty)
        const cat = JSON.parse(catty)

        // console.log(cat)
        // console.log(cat.url)

        message.channel.send(cat.url)
        
    }
    
    )
}