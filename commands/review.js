const config = require('../config.json');
const chalk = require('chalk');
const { MessageEmbed } = require('discord.js');
module.exports.run = async(nat2k15, message, args) => {
    let firstchannel = message.guild.channels.cache.get(config.review.allowed_channels);
    let lastchannel = message.guild.channels.cache.get(config.review.review_sent);
    let clientrole = message.guild.roles.cache.get(config.review.client_role);
    if (!firstchannel) {
        message.channel.send(`Contact the bot owner and tell him to check console`)
        console.log(chalk.red `[ERROR] ` + chalk.white `You are missing a channel ID in the config or it's invaild`)
    } else {
        if (!lastchannel) {
            message.channel.send(`Contact the bot owner and tell him to check console`)
            console.log(chalk.red `[ERROR] ` + chalk.white `You are missing a channel ID in the config or it's invaild`)
        } else {
            if (!clientrole) {
                message.channel.send(`Contact the bot owner and tell him to check console`)
                console.log(chalk.red `[ERROR] ` + chalk.white `You are missing a role ID in the config or it's invaild`)
            } else {
                if (message.channel.id !== firstchannel.id) {
                    let e1 = new MessageEmbed()
                        .setDescription(`You cannot use this command in this channel! it can only be used in ${firstchannel}`)
                        .setColor(config.embed.color)
                        .setFooter(`Made by NAT2K15`)
                    message.channel.send(e1).then(msg => msg.delete({ timeout: 25000 }))
                } else {
                    if (!message.member.roles.cache.has(clientrole.id)) {
                        let e2 = new MessageEmbed()
                            .setDescription(`You cannot use this command!. You are not a client`)
                            .setColor(config.embed.color)
                        message.channel.send(e2).then(msg => msg.delete({ timeout: 25000 }))
                    } else {
                        message.channel.send(`What was the product you purchased`)
                        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(firstmsg => {
                            if (firstmsg.first().content.toLowerCase() !== undefined)
                                var product = firstmsg.first().content;
                            message.channel.send(`Please input your review`)
                            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(secondmsg => {
                                if (secondmsg.first().content.toLowerCase() !== undefined)
                                    var review = secondmsg.first().content;

                                message.channel.send(`What would you rate the product out of ten?`)
                                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(foruthgmsg => {
                                    if (foruthgmsg.first().content.toLowerCase() !== undefined)
                                        var rate = foruthgmsg.first().content;

                                    let e1 = new MessageEmbed()
                                        .setTitle(`A review has been made by ${message.author.tag}`)
                                        .addField(`The Product`, product)
                                        .addField(`Review`, review)
                                        .addField(`The product it self out of ten`, rate)
                                        .setThumbnail(message.author.displayAvatarURL({ format: `png`, dynamic: true }))
                                        .setTimestamp()
                                        .setColor(config.embed.color)
                                        .setFooter(config.embed.footer)
                                    lastchannel.send(e1)
                                    message.channel.bulkDelete(7)
                                })
                            })
                        })
                    }
                }
            }
        }
    }
}

module.exports.help = {
    name: "review",
    category: "review",
    aliases: []
};