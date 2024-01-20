const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'review',
    description: 'Review a product',
    options: [{
            name: 'product',
            description: 'The product you purchased',
            type: 'STRING',
            required: true,
        },
        {
            name: 'review',
            description: 'The review of the product',
            type: 'STRING',
            required: true,
        },
        {
            name: 'rate',
            description: 'The rate of the product out of ten',
            type: 'INTEGER',
            required: true,
        },
    ],
    async run(interaction, client, config, channel) {
        let product = interaction.options.getString('product');
        let review = interaction.options.getString('review');
        let rate = interaction.options.getInteger('rate');
        let e1 = new MessageEmbed()
            .setTitle(`A review has been made by ${interaction.user.tag}`)
            .addFields([{ name: `The Product`, value: `${product}` }, { name: `Review`, value: `${review}` }, { name: `The product it self out of ten`, value: `${rate}` }])
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(config.embed.color)
            .setFooter({text: config.embed.footer})
        channel.send({embeds: [e1]})
        interaction.reply({ content: `Your review has been sent`, ephemeral: true })
    }
}