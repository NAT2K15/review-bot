const { Client, Collection, Events, ModalBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ButtonBuilder, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const chalk = require('chalk')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Required to read message content
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction] // Partial handling for DMs, messages, and reactions
});
const config = require('./config.js')
client.commands = new Collection();
client.once(Events.ClientReady, () => {
    let commmands = []
    fs.readdirSync('./commands').filter(file => file.endsWith('.js')).forEach(file => {
        const command = require(`./commands/${file}`)
        if (command) {
            client.commands.set(command.name, command)
            commmands.push(command)
            console.log(chalk.green(`[COMMAND] Loaded ${command.name}`))
        }
    })
    client.application.commands.set(commmands)

    console.log(chalk.green(`[SUCCESS] ${client.user.tag} is now online!`));
})


client.on(Events.InteractionCreate, async(interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId.toLowerCase() == "natreview") {
            if (config.clientRoles.enabled) {
                if (!interaction.member.roles.cache.has(config.clientRoles.clienRole)) return interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true })
                client.openhandesomemodal(interaction)
            } else {
                client.openhandesomemodal(interaction)
            }
        }
    }

    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName)
        if (!command) return;
        try {
            command.run(client, interaction, config)
        } catch (e) {
            console.log(chalk.red(`[ERROR] ${e}`))
            interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId == 'nat2k15developmetntrateiscoolfr') {
            const serviceRating = interaction.fields.getTextInputValue(`natreview-${interaction.member.id}-rate`);
            const feedback = interaction.fields.getTextInputValue(`natreview-${interaction.member.id}-feedback`);
            const image = interaction.fields.getTextInputValue(`natreview-${interaction.member.id}-image`) ? interaction.fields.getTextInputValue(`natreview-${interaction.member.id}-image`) : null;
            if (isNaN(serviceRating)) return interaction.reply({ content: "The service rating must be a number!", ephemeral: true });
            if (serviceRating < 1 || serviceRating > 5) return interaction.reply({ content: "The service rating must be between 1-5!", ephemeral: true });
            const starRating = '⭐'.repeat(serviceRating);

            const embed = new EmbedBuilder()
                .setColor(config.embed.color)
                .setFooter({ text: config.embed.footer })
                .setTimestamp()
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.member.user.displayAvatarURL({ dynamic: true }))
                .setTitle("New Service Review")
                .setDescription(feedback)
                .addFields({ name: "Service Rating", value: `${starRating} (${serviceRating}/5)`, inline: true }, // Star rating and numeric value
                    { name: "Reviewed by", value: `${interaction.member.user.username} - ${interaction.member.id}`, inline: true } // Reviewer info
                );

            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("natreview").setLabel("Submit A Review").setStyle(ButtonStyle.Primary))
            if (image) {
                if (image.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
                    embed.setImage(image);
                }
            }

            const reviewChannel = interaction.guild.channels.cache.get(config.reviewChannel);
            if (!reviewChannel) return interaction.reply({ content: "The review channel was not found!", ephemeral: true });

            reviewChannel.send({ embeds: [embed], components: [row] });
            interaction.reply({ content: "Your review has been submitted!", ephemeral: true });

            const loggingChannel = interaction.guild.channels.cache.get(config.loggingChannel);
            if (!loggingChannel) return console.log(chalk.red(`[ERROR] The logging channel was not found!`));
            loggingChannel.send({ content: `**${interaction.member}** has submitted a review in **${interaction.guild.name}**!`, embeds: [embed] });

        }
    }


});

client.openhandesomemodal = async function(interaction) {
    const modal = new ModalBuilder()
        .setCustomId(`nat2k15developmetntrateiscoolfr`)
        .setTitle(`${interaction.guild.name} - Reviews`)

    const service = new TextInputBuilder()
        .setCustomId(`natreview-${interaction.member.id}-rate`)
        .setLabel("Rate the service 1-5")
        .setPlaceholder("1-5")
        .setMinLength(1)
        .setMaxLength(1)
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    const feedback = new TextInputBuilder()
        .setCustomId(`natreview-${interaction.member.id}-feedback`)
        .setLabel("Feedback")
        .setPlaceholder("Your feedback here")
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(5)
        .setMaxLength(2000)
        .setRequired(true)
    const image = new TextInputBuilder()
        .setCustomId(`natreview-${interaction.member.id}-image`)
        .setLabel("Image")
        .setPlaceholder("Image URL")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(100)
        .setRequired(false)
    const firstActionRow = new ActionRowBuilder().addComponents(service);
    const secondActionRow = new ActionRowBuilder().addComponents(feedback);
    const thirdctionRow = new ActionRowBuilder().addComponents(image);

    modal.addComponents(firstActionRow, secondActionRow, thirdctionRow)

    await interaction.showModal(modal);


}

client.login(config.token).catch(e => {
    console.log(chalk.red(`[ERROR] There is an error with the token\n ${e}`))
    process.exit(1)
})