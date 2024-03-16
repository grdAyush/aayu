const GuildSchema = require("../../../handlers/xata").getXataClient().db.GuildSchema;
const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: '247',
        description: '247 mode on or off',
       aliases: ["24/7", "24/7mode", "247mode"],
        permissions: "ManageGuild",
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
        let Data = await GuildSchema.read(`${message.guild.id}`)
        if(!Data) {
            Data = await GuildSchema.create({
                id: `${message.guild.id}`,
                prefix: null,
                TwentyFourSeven: true,
                Autoplay: false,
            })

            const embed = new EmbedBuilder()
            .setDescription("`🌙` | *Mode 24/7 has been:* `Activated`")
            .setColor(client.color);
                        return message.reply({ embeds: [embed] });
        } else if(!Data.TwentyFourSeven){
        Data.update( {
            TwentyFourSeven: true,
        })

        const embed = new EmbedBuilder()
        .setDescription("`🌕` | *Mode 24/7 has been:* `Activated`")
        .setColor(client.color);
                    return message.reply({ embeds: [embed] });
        } else if(Data.TwentyFourSeven){
            Data.update( {
                TwentyFourSeven: false,
            })

            const embed = new EmbedBuilder()
            .setDescription("`🌙` | *Mode 24/7 has been:* `Deactivated`")
            .setColor(client.color);
                        return  message.reply({ embeds: [embed] })
        }
    }


        

     
                                         
    
};