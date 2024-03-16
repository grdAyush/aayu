        const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'clear',
        description: 'clear the queue',
       aliases: [],
        permissions: null,
  cooldown: 7000,
        category: "Music",
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.reply(`I'm not playing anything right now`);
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
        if (channel.id !== message.guild.members.me.voice.channel.id) return message.reply(`You are not in the same voice channel`);

        player.queue.clear();
        const embed = new EmbedBuilder()
        .setDescription("`📛` | *Queue has been:* `Cleared`")
        .setColor(client.color);

    return interaction.reply({ embeds: [embed] });

                                         
    }
};