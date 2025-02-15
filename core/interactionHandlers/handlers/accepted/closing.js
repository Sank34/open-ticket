const discord = require('discord.js')
const bot = require('../../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const getconfigoptions = require("../../../getoptions")
const permissionChecker = require("../../../utils/permisssionChecker")
const storage = bot.storage
const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.main_color

const button = discord.ButtonBuilder
const arb = discord.ActionRowBuilder
const bs = discord.ButtonStyle

module.exports = () => {
    //CLOSE
    var closeTicketButtonChecker = false
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTcloseTicketTrue") return
        
        interaction.deferUpdate()

        if (closeTicketButtonChecker == true) return
        closeTicketButtonChecker = true

        const firstcomponents = interaction.message.components

        if (config.system.closeMode == "adminonly"){
            if (!permissionChecker.command(interaction.user.id,interaction.guild.id)){
                if (!permissionChecker.sendUserNoPerms(interaction.user)){
                    permissionChecker.sendChannelNoPerms(interaction.channel)
                }
                interaction.message.edit({components:[firstcomponents]})
                closeTicketButtonChecker = false
                return
            }
        }
        
        interaction.message.edit({components:[bot.buttons.close.openRowDisabled]})

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        interaction.channel.send({embeds:[bot.embeds.commands.closeEmbed(interaction.user)],components:[bot.buttons.close.closeCommandRow]})
        await require("../../../ticketCloser").NEWcloseTicket(interaction.member,interaction.channel,prefix,"close",false,true)
        closeTicketButtonChecker = false
    })
}