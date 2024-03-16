const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'join',
        description: 'join a chanel',
       aliases: ["aja",  "connect", "summon"],
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
       
        const botVoiceChannel = message.guild.members.me.voice;
        if (botVoiceChannel && botVoiceChannel.channel && botVoiceChannel.channel.id) {
            if (botVoiceChannel.channel.id === message.member.voice.channel.id) {
                return message.reply(`I am already in the same voice channel as you!`);
            } else {
                return message.reply(`I am already in a different voice channel`);
            }
        }
       
        const player = client.riffy.players.get(message.guild.id);
        if(player) return message.reply(`I am already in the voice channel`)  
        await client.riffy.createConnection({
            guildId: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            deaf: true
        });

        const embed = new EmbedBuilder()
        .setDescription(`\`🔊\` | *Joined:* \`${channel.name}\``)
        .setColor(client.color);

        return message.reply({ embeds: [embed] });
                                         
    }
};
