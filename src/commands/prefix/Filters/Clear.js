const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'disablefilters',
        description: 'remove the all filters',
       aliases: ["clearfilters", "cf", "disablefilter", "reset-filters"],
        permissions: null,
  cooldown: 7000
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
              
        player.filters.clearFilters();
        message.reply({ 
            embeds: [
                new EmbedBuilder()
                .setTitle(`Removed All Filters`)
                .setColor(client.color)
            ]
        })
    }
};