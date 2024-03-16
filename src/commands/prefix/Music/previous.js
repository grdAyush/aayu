        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'previous',
        description: 'play previous song',
       aliases: [],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
        if (!channel.permissionsFor(message.guild.members.me).has(PermissionFlagBits.Connect)) return message.reply(`I don't have permission to join your voice channel!`);
        if (!channel.permissionsFor(message.guild.members.me).has(PermissionFlagBits.Speak)) return message.reply(`I don't have permission to speak in your voice channel!`);

        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.reply(`I'm not playing anything`);

        if(!player.previous) return message.reply(`There is no previous song`);
        player.queue.unshift(player.previous);
        player.stop()
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Playing** [${player.previous.info.title}](${player.previous.info.uri}) • ${player.previous.info.requester}`)
                           
        message.reply({ content: " ", embeds: [embed] })
    }
};