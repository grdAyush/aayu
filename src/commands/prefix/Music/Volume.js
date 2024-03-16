        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'volume',
        description: 'set the volume of the song',
       aliases: ["vol", "awaj", "awaz", "v", "dhwani"],
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

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('You need to be in a voice channel to use this command.');
        if (channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send('You must be in the same voice channel as me to use this command.');
        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.channel.send('No song/s currently playing in this guild.');
        if (!player.playing) return message.channel.send('No song/s currently playing in this guild.');

        const volume = Number(args[0]);
        if (!volume) return message.channel.send('Please provide a valid number.');
        if (volume < 10 || volume > 150) return message.channel.send('Please provide a valid number between 10 - 100.');
        player.setVolume(volume);
        const embed = new EmbedBuilder()
            .setDescription(`Volume set to ${volume}`)
            .setColor(client.color)
            .setTimestamp()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        message.channel.send({ embeds: [embed] })
                                         
    }
};
