        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Database = require("../../../handlers/xata").getXataClient().db.Level;
module.exports = {
    structure: {
        name: 'level-rate',
        description: 'Change the XP rate of your server. (in percentage)',
       aliases: ["l-rate", "lrate", "levelrate", "level-rate"],
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

        if (!data || data.Toggle === false || !data.Toggle) return message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Bruh! Leveling System is not enabled")
            .setColor(client.color)
        ]})

        const rate = Number(args[0]);
                   
        if (!rate || rate < 0 || rate > 1000 ) return message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Please provide valid XP Rate from 1% to 1000% ( you don't have to type % just the number will work )")
            .setColor(client.color)
        ]})

    await data.update({ XPRate: rate / 100 })

    message.reply({ embeds: [
        new EmbedBuilder()
        .setTitle("Leveling")
        .setDescription(`XP Rate has been set to ${rate}%`)
        .setColor(client.color)
    ]})
    }
};