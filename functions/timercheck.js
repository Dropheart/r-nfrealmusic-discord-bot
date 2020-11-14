const yml = require('yaml')
const fs = require('fs')



module.exports = (client) => {

    var check = setInterval(timer, 1000)

    function timer() {
        fs.readdir(`./timers/mutes`, (err, files) => {
            files.forEach(file => {
                var fsread = fs.readFileSync(`./timers/mutes/${file}`, 'utf8')
                try { let fsread2 = fs.readFileSync(`./servers/${file}`, 'utf8')
                    var serverconf = yml.parseDocument(fsread2).toJSON()
                    var muterole = serverconf.muteRole
                } catch (err) {
                }

                parsed = yml.parseDocument(fsread).toJSON()
                mafs = Math.floor(new Date() / 1000)
                var guildid = file.slice(0, -4)
                try {
                    for (var [key, value] of Object.entries(parsed)) {
                        value = parseInt(value)
                        console.log(value)
                        if (mafs >= value) {
                            client.guilds.fetch(guildid).then(guild => guild.member(key).roles.remove(muterole, 'Mute time expired'))
                            let regex = new RegExp("'" + key + "': \\d{10,11}\\n", "g") 
                            let newData = fsread.replace(regex, '')
                            fs.writeFileSync(`./timers/mutes/${file}`, newData, 'utf8')            
                        }
                    }
                } catch (err) {
                }
            
            })
        })

    }
}