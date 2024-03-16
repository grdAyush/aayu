        const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Track = require("../../../handlers/xata").getXataClient().db.Track;
module.exports = {
    structure: {
        name: 'leave',
        description: 'make me leave a voice channel',
       aliases: ["nikal", "disconnect", "dc"],
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
        if(!player) return message.reply(`I am not in a voice channel`);
if(player.current)
{        const Mdata = await Track.filter({
            Guild: message.guild.id,
            Track: player.current.info.identifier
        }).getFirst();

        if(Mdata)  {
            const ch =  client.channels.cache.get(Mdata.Channel)
            if(ch) {
                await ch.messages.fetch(Mdata.Message).then(async (msg) => {
                    await msg.delete();
        
                await   Mdata.delete();
                }) .catch(error => {
                    console.error(`Error fetching message: ${error}`);
                }); 
            }
        }
    
    }
        await player.destroy();

        const embed = new EmbedBuilder()
        .setDescription(`\`🚫\` | *Left:* | \`${channel.name}\``)
            .setColor(client.color);

        return message.reply({ embeds: [embed] });
    }
};
