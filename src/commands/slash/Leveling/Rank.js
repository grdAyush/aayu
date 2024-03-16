            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Database = require("../../../handlers/xata").getXataClient().db.Level;
            const User = require("../../../handlers/xata").getXataClient().db.UserXP;
            const { RankCard } = require("musicard-bun")
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("rank")
                    .setDescription("check your or someone's rank")
                    .addUserOption(option => option.setName("user").setDescription("user to check rank").setRequired(false)),
               options: {
                    nsfw: false,
                    developers: false,
                    cooldown: 5000
                },
               /**
                 * @param {ExtendedClient} client
                * @param {ChatInputCommandInteraction} interaction
                */
                run: async (client, interaction) => {

                    await interaction.deferReply();
                    const user = interaction.options.getUser("user") || interaction.user;


        const data = await Database.read(`${interaction.guild.id}`);

        if (!data || data.Toggle === false || !data.Toggle) return interaction.editReply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Bruh! Leveling System is not enabled")
            .setColor(client.color)
        ]})

        const Data = await User.filter({
            Guild: interaction.guild.id,
            User: user.id
        }).getFirst();


        if (!Data) return interaction.editReply({ embeds: [
            new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("The User don't have any XP yet")
            .setColor(client.color)
        ]})

        const Rank = await User.filter({
            Guild: interaction.guild.id
        }).sort("Level", "desc").getAll();

        let reqXP = 100;

        for (let i = 1; i <= Data.Level; i++)
        reqXP += 5 * (i ^ 2) + 50 * i + 100;
  
        const rank = Rank.findIndex((u) => u.User === user.id);

        const Progress = (Data.XP / reqXP) * 100;
        const card = new RankCard()
        .setName(`${user.displayName}`)
        .setLevel(`Level: ${Data.Level}`)
        .setColor("auto")
        .setBrightness(100)
        .setAvatar(`${user.displayAvatarURL({ extension: "jpg" })}`)
        .setProgress(Progress) 
        .setRank(`${rank + 1}`)
        .setCurrentXp(Data.XP)
        .setRequiredXp(reqXP)
        .setShowXp(true);
        
        const cardBuffer = await card.build();
    
        const attachment = new AttachmentBuilder(cardBuffer, { name: "RankCard.png" })
        
       interaction.editReply({ files: [attachment] })

                                   
                }
            };