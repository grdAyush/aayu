        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'resume',
        description: 'resume the player',
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
            
            const { channel } = message.member.voice;
            if (!channel) return message.reply(`You are not in a voice channel`);
            if(message.guild.members.me.voice.channel.id !== message.member.voice.channel.id) return message.reply(`You are not in the same voice channel as me!`);
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return message.reply(`I am Not Playing Right Now`);
    
            if (player.paused) {
                player.pause(false);
                const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("`⏯` Song Has Been Resumed")
    
                return message.channel.send(embed);
            } else {
                player.pause(true);
                const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("`⏯` Song Has Been Paused")
    
                return message.channel.send(embed);
            }
                                         
    }
};