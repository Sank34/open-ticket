const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"close")) return


        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            
            const closebutton = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("closeTicketTrue1")
                    .setDisabled(false)
                    .setStyle("SECONDARY")
                    .setEmoji("🔒")
            ])

            msg.channel.send({embeds:[bot.errorLog.success("Close this ticket!","You can close this ticket by clicking on the button below!")],components:[closebutton]})

            log("command","someone used the 'close' command",[{key:"user",value:msg.author.tag}])
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "close") return

       interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            
            const closebutton = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("closeTicketTrue1")
                    .setDisabled(false)
                    .setStyle("SECONDARY")
                    .setEmoji("🔒")
            ])

            interaction.reply({embeds:[bot.errorLog.success("Close this ticket!","You can close this ticket by clicking on the button below!")],components:[closebutton]})

            log("command","someone used the 'close' command",[{key:"user",value:interaction.user.tag}])
            
        })
    })
}