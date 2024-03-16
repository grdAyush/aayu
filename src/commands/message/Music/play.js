const { MessageContextMenuCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { convertTime } = require("../../../../structures/ConvertTime");
module.exports = {
    structure: new ContextMenuCommandBuilder()
        .setName('Play')
        .setType(3),
    /**
     * @param {ExtendedClient} client 
     * @param {MessageContextMenuCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const value = (interaction.channel.messages.cache.get(interaction.targetId).content ?? await interaction.channel.messages.fetch(interaction.targetId));
        if (!value.startsWith('https')) return interaction.editReply(`Please use link to play music`);
        
        const player = await client.riffy.createConnection({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            deaf: true,
        });

        const res = await client.riffy.resolve({ query: value, requester: interaction.member });

        const { loadType, tracks, playlistInfo } = res;

        if (loadType === 'playlist') {
            for (const track of tracks) {
                track.info.requester = interaction.member;
                player.queue.add(track);
            }

            if (!player.playing && !player.paused) player.play();
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • ${playlistInfo.name} • ${tracks[0].info.requester}**`)
        
            return interaction.editReply({ content: " ", embeds: [embed] })
        } else {
            const track = tracks[0];
            track.info.requester = interaction.member;
            player.queue.add(track);
            if (!player.playing && !player.paused) player.play();
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • ${track.info.title} • ${track.info.requester}`)
        
            return interaction.editReply({ content: " ", embeds: [embed] })
        }
                                
    }  
};