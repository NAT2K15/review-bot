module.exports = {
    name: "review",
    description: "Leave a review for the server!",
    async run(client, interaction, config) {
        if (config.clientRoles.enabled) {
            if (!interaction.member.roles.cache.has(config.clientRoles.clienRole)) return interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true })
            client.openhandesomemodal(interaction)
        } else {
            client.openhandesomemodal(interaction)
        }
    }
}