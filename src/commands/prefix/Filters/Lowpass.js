const { Message, PermissionFlagBits, EmbedBuilder, Embed } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const filter = "lowpass"
module.exports = {
    structure: {
        name: `${filter}`,
        description: `apply the filter of  ${filter}`,
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
        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.reply(`I am Not Playing Right Now`);
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
        if(message.guild.members.me.voice.channel.id !== message.member.voice.channel.id) return message.reply(`You are not in the same voice channel as me!`);
              
        
        player.filters.setLowPass(true)


        message.reply({ 
            embeds: [
                new EmbedBuilder()
                .setTitle(`Applied the filter of ${filter} `)
                .setDescription(`To Disable It Use: \`disablefilter\` command`)
                .setColor(client.color)
            ]
        })
    }
};