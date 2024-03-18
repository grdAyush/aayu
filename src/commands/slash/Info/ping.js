const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        interaction.deferReply({ ephemeral: true });

       const msg =  await interaction.channel.send({ content: 'Pinging...', ephemeral: true });

        const latency =  msg.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = client.ws.ping;

        await msg.edit({ content: " ", embeds: [ new EmbedBuilder().setThumbnail(client.user.displayAvatarURL()).setTitle(`__**Latency Check**__`).setDescription(`**・Message :** ${latency}ms\n**・NodeJS :** ${apiLatency}ms`).setColor(client.color)] });
 await interaction.deleteReply();


    }


};
