const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"rename")) return

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            

            if (!msg.member.permissions.has("MANAGE_CHANNELS") && !msg.member.permissions.has("ADMINISTRATOR")){
                return msg.channel.send({embeds:[bot.errorLog.noPermsMessage]})
            }
            
            var newname = msg.content.split(config.prefix+"rename")[1].substring(1)

            if (!newname) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage("Missing Argument `<name>`:\n`"+config.prefix+"rename <name>`")]})

            var name = msg.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            if (!prefix) prefix = "noprefix-"

            msg.channel.setName(prefix+newname)
            msg.channel.send({embeds:[bot.errorLog.success("The name has changed!","Warning: you can only change the channel name 2 times per minute!\n(this is due discord rate limits)")]})

            log("command","someone used the 'rename' command",[{key:"user",value:msg.author.tag}])
            log("system","ticket renamed",[{key:"user",value:msg.author.tag},{key:"ticket",value:name},{key:"newname",value:newname}])
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "rename") return

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id)return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            
            const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return interaction.guild.members.cache.find((m) => m.id == interaction.member.id).roles.cache.has(item)}) == false && permsmember.permissions.has("ADMINISTRATOR")){
                interaction.reply({embeds:[bot.errorLog.noPermsMessage]})
                return
            }
            
            var newname = interaction.options.getString("name")
            var name = interaction.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            if (!prefix) prefix = "noprefix-"

            interaction.channel.setName(prefix+newname)
            interaction.reply({embeds:[bot.errorLog.success("The name has changed!","Warning: you can only change the channel name 2 times per minute!\n(this is due discord rate limits)")]})

            log("command","someone used the 'rename' command",[{key:"user",value:interaction.user.tag}])
            log("system","ticket renamed",[{key:"user",value:interaction.user.tag},{key:"ticket",value:name},{key:"newname",value:newname}])
            
        })
    })
}