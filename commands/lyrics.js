const genius = require('genius-lyrics-api')
const getLyrics = require('genius-lyrics-api/lib/getLyrics')
const Discord = require('discord.js')

exports.run = (client, message, args) => {
    req = args.join(' ')
    song = req.split('-')
    
    console.log(song)
    try {
        title = song[0].trim()
        artist = song[1].trim()
        var options = {
            apiKey: client.config.genius,
            title: title,
            artist: artist,
            optimizeQuery: true
        }
    } catch {
        message.channel.send("Ensure your message is in the format `song name - artist` with the dash in the middle.")
        failed = 1
    }


    getLyrics(options).then((lyrics) => {
        if (failed) return
        const split = lyrics.match(/[\s\S]{1,2000}\n/g) || [];
        let page = 0 
        const pages = split.length

        genius.searchSong(options).then((moosic) => {
            const embed = new Discord.MessageEmbed()
                .setColor('000000')
                .setTitle(moosic[0].title)
                .setURL(moosic[0].url)
                .setDescription(split[page])
                .setThumbnail(moosic[0].albumArt)
                .setTimestamp()
                .setFooter('Requested by ' + message.author.username)
            
            console.log(split)
            console.log(moosic[0])
            console.log(pages)

            message.channel.send(embed).then(message => {
                if (split.length <= 1) return;
                message.react('➡')
                message.react('⏹️')

                const collector = message.createReactionCollector((reaction, user) =>
                    ['⬅', '➡','⏹️'].includes(reaction.emoji.name) && user.id !== message.author.id, {time: 240000}
                )

                collector.on('collect', reaction => {
                    message.reactions.removeAll().then(async() => {
                        if(reaction.emoji.name === '➡') {
                            if (pages == 1 || page == pages-1) return;
                            page++
                            embed.setDescription(split[page])
                            message.edit(embed)
                            if (page != pages-1) {
                                message.react('➡')
                            }
                            message.react('⬅')
                            message.react('⏹️')
                            console.log(page)
                            console.log(pages)
                        } else if(reaction.emoji.name === '⬅') {
                            if (page === 0) return;
                            page--
                            embed.setDescription(split[page])
                            message.edit(embed)
                            message.react('➡')
                            if (page >= 1) {
                                message.react('⬅') 
                            }
                            message.react('⏹️')
                        } else if(reaction.emoji.name == '⏹️') {
                            collector.stop()
                            message.reactions.removeAll()
                        }
                    })
                })
            })
        })
    })
}
