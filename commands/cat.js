var http = require("urllib");

exports.run = (client, message, args) => {
  link =
    "https://api.thecatapi.com/v1/images/search?api_key=" +
    client.config.catapikey;
  http.request(link, function (err, data, res) {
    if (err) {
      message.channel.send(err);
    }
    const information = data.toString();
    const cat = JSON.parse(information);
    message.channel.send(cat[0].url);
  });
};
