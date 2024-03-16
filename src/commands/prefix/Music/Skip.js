        const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'skip',
        description: 'Skip The current Playing Song',
       aliases: ["s"],
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
        if (!player) return message.reply(`I am Not Playing Right Now`);
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
        if(message.guild.members.me.voice.channel.id !== message.member.voice.channel.id) return message.reply(`You are not in the same voice channel as me!`);

        player.stop();

        const embed = new EmbedBuilder()
        .setDescription("`⏭️` | *Skipped the song*")
        .setColor(client.color);
        return message.reply({ embeds: [embed] });
                                         
    }
};