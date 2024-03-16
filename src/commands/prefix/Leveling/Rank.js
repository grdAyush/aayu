const { Message, PermissionFlagBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Database = require("../../../handlers/xata").getXataClient().db.Level;
const User = require("../../../handlers/xata").getXataClient().db.UserXP;
const { RankCard } = require("musicard-bun")
module.exports = {
    structure: {
        name: 'rank',
        description: 'check your rank',
        aliases: ["r", "level"],
        permissions: null,
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

    let LUser = message.mentions.users.first() ? message.mentions.users.first() : message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0]).user : message.author;
        let user = await User.filter({
            Guild: message.guild.id,
            User: LUser.id
        }).getFirst();

        if (!user) return message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("The User don't have any XP yet")
            .setColor(client.color)
        ]})

        const Rank = await User.filter({
            Guild: message.guild.id
        }).sort("Level", "desc").getAll();

        let reqXP = 100;

        for (let i = 1; i <= user.Level; i++)
        reqXP += 5 * (i ^ 2) + 50 * i + 100;
  
        const rank = Rank.findIndex((u) => u.User === LUser.id);

        const Progress = (user.XP / reqXP) * 100;
        


        const card = new RankCard()
        .setName(`${LUser.displayName}`)
        .setLevel(`Level: ${user.Level}`)
        .setColor("auto")
        .setBrightness(100)
        .setAvatar(`${LUser.displayAvatarURL({ extension: "jpg" })}`)
        .setProgress(Progress) 
        .setRank(`${rank + 1}`)
        .setCurrentXp(user.XP)
        .setRequiredXp(reqXP)
        .setShowXp(true);
        
        const cardBuffer = await card.build();
    
        const attachment = new AttachmentBuilder(cardBuffer, { name: "RankCard.png" })
        
        message.reply({ files: [attachment] })
                                         
    }
};