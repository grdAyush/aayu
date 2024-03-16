        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Database = require("../../../handlers/xata").getXataClient().db.Level;
module.exports = {
    structure: {
        name: 'level-toggle',
        description: 'enable disable the text leveling system',
        aliases: ["leveling-toggle", "leveling", "level-toggle", "level"],
        permissions: ["Administrator"]
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        const data = await Database.read(`${message.guildId}`);
        
        if( !data || data.Toggle === false || !data.Toggle) {


if (!data){            
    
    await Database.create({
                id: message.guildId,
                Toggle: true
            })
        
        } else {
            data.update({
                Toggle: true
            });
        }
            message.reply({ embeds: [
                new EmbedBuilder()
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setTitle("Leveling")
                .setDescription("Leveling System Has been enabled\n\nYour Next Tasks Can Be `level-announce` and `level-rewards`")
                .setColor(client.color)
            ]})
        
        } else if(data.Toggle === true) {
            data.update({
                Toggle: false
            });
            message.reply({ embeds: [
                new EmbedBuilder()
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setTitle("Leveling")
                .setDescription(`Leveling System Has been disabled`)
                .setColor(client.color)
            ]})
        }


                                         
    }
};