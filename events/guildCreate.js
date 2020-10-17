const fs = require('fs')



module.exports = (client, guild) => {
    fs.open(`./servers/${guild.id}.json`, 'w', function(err) {
        if(err) console.log(err);
        console.log(`Joined ${guild.name} / ${guild.id}`)
    })
}