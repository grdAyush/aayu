const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Database = require("../../../handlers/xata").getXataClient().db.Level;
module.exports = {
    structure: {
        name: 'level-limits',
        description: 'change the up and down limits of your server.',
       aliases: ["l-limits", "llimits", "levellimits", "level-limits"],
        permissions: ["Administrator"],
        cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        const data = await Database.read(`${message.guild.id}`);

        if (!data || data.Toggle === false && !data.Toggle) return message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Bruh! Leveling System is not enabled")
            .setColor(client.color)
        ]})

        const up = Number(args[0]);
        const down = Number(args[1]);

        if (!up || !down || up < 0 || down < 0 || up > 1000 || down > 1000) return message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Please provide valid limits from 1 to 1000. These Are Minimum and Maximum XP Incriments\n\n**Example:**\n ```level-limits 10 20 ( this will set the up limit to 10 and down limit to 20)```")
            .setColor(client.color)
        ]})

        await data.update({ Uplimit: up, LowLimit: down })

        message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(`XP Limits has been set to ${up} and ${down}`)
            .setColor(client.color)
        ]})


                                         
    }
};