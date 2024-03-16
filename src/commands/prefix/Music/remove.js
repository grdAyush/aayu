        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'remove',
        description: 'remove a song from the queue',
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
        if (message.guild.members.me.voice.channel.id !== message.member.voice.channel.id) return message.reply(`You are not in the same voice channel as me!`);
        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.reply(`I am Not Playing Right Now`);
        const queue = player.queue;
        if (!queue) return message.reply(`There is nothing in the queue`);

        const track = parseInt(args[0]);
        if (!track) return message.reply(`Please Provide a Valid Number`);
        if (track > queue.length) return message.reply(`Please Provide a Valid Number`);

  
        const embed = new EmbedBuilder()
            .setTitle(`Removed Song`)
            .setDescription(`**Removed ${queue[track - 1].info.title} From The Queue**`)
            .setColor(client.color)
            .setTimestamp();
            player.queue.remove(track - 1);
            message.reply({embeds: [embed]});

                                         
    }
};