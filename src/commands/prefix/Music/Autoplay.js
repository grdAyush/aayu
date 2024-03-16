const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const GuildSchema = require('../../../handlers/xata').getXataClient().db.GuildSchema;
module.exports = {
    structure: {
        name: 'autoplay',
        description: 'Set autoplay enabled or disabled',
       aliases: [],
        permissions: 'ManageGuild',
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

        let Data = await GuildSchema.read(`${message.guild.id}`);

        if(!Data) {
            Data = await GuildSchema.create({
                id: `${message.guild.id}`,
            })
        }

        if(Data.Autoplay){
            Data.update( {
                Autoplay: false,
            })
            const embed = new EmbedBuilder()
            .setDescription("`📻` | *Autoplay has been:* `Deactivated`")
            .setColor(client.color);

        return message.reply({ embeds: [embed] });
        } else if(!Data.Autoplay){
            Data.update( {
                Autoplay: true,
            })
            const embed = new EmbedBuilder()
            .setDescription("`📻` | *Autoplay has been:* `Activated`")
            .setColor(client.color);
            
            return message.reply({ embeds: [embed] });
        }
                                         
    }
};