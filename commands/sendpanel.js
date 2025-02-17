const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
    name: "sendpanel",
    description: "Send the panel to a channel!",
    async run(client, interaction, config) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true })
        const embed = new EmbedBuilder()
            .setColor(config.embed.color)
            .setFooter({ text: config.embed.footer })
            .setTimestamp()
            .setAuthor({ name: `${interaction.guild.name} - Review` })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`Click the "Submit A Review" button attached or use the /review command, fill in your feedback, give a rating of 1-5, and if you want include an image!`)
        const actionRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("natreview").setLabel("Submit A Review").setStyle(ButtonStyle.Primary))
        await interaction.reply({ embeds: [embed], components: [actionRow] })
    }
}