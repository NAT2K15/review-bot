const { Client, Collection, Emoji, MessageEmbed } = require('discord.js');
const nat2k15 = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"] });

const chalk = require('chalk');
const config = require('./config.json')
const fs = require('fs')
nat2k15.prefix = config.prefix;

nat2k15.commands = new Collection()
nat2k15.once('ready', async() => {
    let commmands = []
    fs.readdirSync('./commands').filter(file => file.endsWith('.js')).forEach(file => {
        const command = require(`./commands/${file}`)
        if (command) {
            nat2k15.commands.set(command.name, command)
            commmands.push(command)
            console.log(chalk.green(`[COMMAND] Loaded ${command.name}`))
        }
    })
    nat2k15.application.commands.set(commmands)
    console.log(chalk.green `[SUCCESS]` + chalk.white ` ${nat2k15.user.tag} is now online!`)
})


nat2k15.on('interactionCreate', async(interaction) => {
    if(interaction.isCommand()) {
        const command = nat2k15.commands.get(interaction.commandName)
        if (!command) return;
        try {
            let member = interaction.member;
            let channel = interaction.guild.channels.cache.get(config.review.review_sent)
            let role = interaction.guild.roles.cache.get(config.review.client_role)
            if(!role || !channel) return interaction.reply({ content: `Contact the bot owner and tell him to verify his config info. Ther role or channel are invalid`, ephemeral: true })
            if(member.roles.cache.has(role.id)) {
                await command.run(interaction, nat2k15, config, channel)
            } else {
                let embed = new MessageEmbed()
                    .setColor(config.embed.color)
                    .setFooter({text: config.embed.footer})
                    .setDescription(`You cannot use this command! You are not a client. You must have the ${role} role to use this command`)
                    .setTimestamp()
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        } catch (error) {
            console.log(chalk.red `[ERROR] ` + chalk.white `${error.stack}`)
        }
    }
})


nat2k15.login(config.token)