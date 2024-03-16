        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'loop',
        description: 'loop the queue or song',
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
        
        if(!args[0] || args[0] !== "queue" || args[0] !== "current" || args[0] !== "none")  {const embed = new EmbedBuilder()
            .setDescription("Please Provide a Valid Option\n`queue` or `current` or `none`")
            .setColor(client.color);
            return message.reply({ embeds: [embed] });} else if 
            (args[0] == "queue") {
                player.setLoop("queue");
                const embed = new EmbedBuilder()
                .setDescription("`🔁` | *Loop has been set to:* `Queue`")
                .setColor(client.color);
                return message.reply({ embeds: [embed] });

            } else if (args[0] == "current") {
                player.setLoop("current");
                const embed = new EmbedBuilder()
                .setDescription("`🔁` | *Loop has been set to:* `Current`")
                .setColor(client.color);
                return message.reply({ embeds: [embed] });

            } else {
                player.setLoop("none");
                const embed = new EmbedBuilder()
                .setDescription("`🔁` | *Loop has been set to:* `None`")
                .setColor(client.color);
                return message.reply({ embeds: [embed] });
            }


        
     


                                         
    }
};