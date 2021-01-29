const permcheck= require('../functions/permissioncheck.js')
const sql = require('../mariadb.js')
const { MessageEmbed } = require('discord.js')
const getuid = require('../functions/getuid.js')


exports.run = async (client, message, args) => {
    var permission = permcheck(client, message, message.member, 'case')
    if (!permission) return;

    let uid = getuid(message, args)
    let things = await sql.query(`SELECT caseid, reason, victim, moderator, date, type, link FROM \`${message.guild.id}\` WHERE victim=${uid}`)
    let total = await sql.query(`SELECT MAX(caseid) FROM \`${message.guild.id}\` WHERE victim=${uid}`)
    let myguy = await client.users.fetch(uid)
    
    let total2 = 0
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    things = things.splice(0)
    embed = new MessageEmbed().setAuthor(`Cases for ${myguy.tag} (${total[0]['MAX(caseid)']} total)`, myguy.displayAvatarURL())        
        
        haveit = false
        let fields = 0
        let binary = 1
        for (z in things) {
            console.log(total2, haveit)
            total2 ++
            let caseid = Object.values(things[z])[0]
            let reason = Object.values(things[z])[1]
            let time = new Date(Object.values(things[z])[4] * 1000)
            let type = Object.values(things[z])[5]
            let url = Object.values(things[z])[6]
            time = `${months[time.getUTCMonth()]} ${time.getUTCDate()}, ${time.getUTCFullYear()}`    
            lengt = embed.length + caseid.toString().length + reason.length + time.toString().length + type.length + url.length + 12
            console.log(lengt)
            binary = 0
            if (lengt < 6000 && fields < 25) {
                embed.addField('​', `
                \`${type}\` \`[${time}]\` [#${caseid}](${url}) ${reason} 
                `)
                fields ++
                if (total2 == total[0]['MAX(caseid)']) {message.channel.send(embed)}
                continue
            } else {
                message.channel.send(embed)
                fields = 0
                embed = new MessageEmbed().setAuthor(`Cases for ${myguy.tag} (${total[0]['MAX(caseid)']} total)`, myguy.displayAvatarURL())
                embed.addField('​', `
                \`${type}\` \`[${time}]\` [#${caseid}](${url}) ${reason} 
                `)
                fields ++
                haveit = true
                continue
            }
        } 
        
        if (binary) message.channel.send("This user has no cases.") 
}