const fs = require('fs')

module.exports = (client, guild) => {
    fs.open(`./servers/${guild.id}.yml`, 'w', function(err) {
        if(err) console.log(err);
        console.log(`Joined ${guild.name} / ${guild.id}`)
    })
    fs.open(`./timers/mutes/${guild.id}.yml`, 'w', function(err) {
        if(err) console.log(err);
    })

}