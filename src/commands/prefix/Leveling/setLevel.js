const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Database = require("../../../handlers/xata").getXataClient().db.Level;
const User = require("../../../handlers/xata").getXataClient().db.UserXP;
module.exports = {
    structure: {
        name: 'set-level',
        description: 'set level of the user',
       aliases: [],
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
        let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply('Please mention a user to set level');
        let level = args[1];
        if (!level) return message.reply('Please mention a level to set');
        if (isNaN(level)) return message.reply('Please mention a valid level to set');
        if (level < 0) return message.reply('Please mention a valid level to set');

       
        const data2 = await User.filter({ Guild: message.guild.id, User: user.id }).getFirst();
        if (!data2) return message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("No data found")
            .setColor(client.color)
        ]})

        let reqXP = 100;

        for (let i = 1; i <= parseInt(level) - 1; i++)
        reqXP += 5 * (i ^ 2) + 50 * i + 100;
      await   data2.update({
            Level: parseInt(level),
            XP: reqXP
        }).then(() => {
            message.reply({ embeds: [
                new EmbedBuilder()
                .setTitle("Leveling")
                .setDescription(`Successfully set level of ${user} to ${level}`)
                .setColor(client.color)
            ]})
        }).catch(err => {
            message.reply({ embeds: [
                new EmbedBuilder()
                .setTitle("Leveling")
                .setDescription(`Failed to set level of ${user} to ${level}`)
                .setColor(client.color)
            ]})
            console.log(err);
        })

    }
};