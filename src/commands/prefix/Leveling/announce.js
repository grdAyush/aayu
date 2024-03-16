const { Message, PermissionFlagBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Database = require("../../../handlers/xata").getXataClient().db.Level;
module.exports = {
    structure: {
        name: 'level-announce',
        description: 'setup announce message, channel or enable disable the announce message',
        aliases: ["l-announce", "la"],
        permissions: ["Administrator"],
        cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        const data = await Database.read(`${message.guildId}`);

        if (!data || data.Toggle === false || !data.Toggle) return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Leveling")
                    .setDescription("Bruh! Leveling System is not enabled")
                    .setColor(client.color)
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Configure your leveling announce settings\nFor Settuping Up The Announce Embed You May Use `level-announce-embed`")
            .setColor(client.color)
            .addFields(
                {
                    name: "Toggle",
                    value: data.Announcements ? "Enabled" : "Disabled"
                },
                {
                    name: "Channel",
                    value: data.AnnounceChannel ? `<#${data.AnnounceChannel}>` : "Not Set"
                },
                {
                    name: "Message",
                    value: data.AnnounceMessage ? data.AnnounceMessage : "Not Set"
                }
            )
            .setTimestamp()

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("toggle").setEmoji(client.emoji.button).setLabel("Toggle").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("channel").setLabel("Channel").setEmoji(client.emoji.channel).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("message").setEmoji(client.emoji.msg).setLabel("Message").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("done").setLabel("Done").setStyle(ButtonStyle.Secondary)
        )

        const msg = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

        collector.on("collect", async i => {
            const data = await Database.read(`${message.guildId}`);
            if (i.customId === "toggle") {


                i.deferUpdate();


                if (data.Announcements) {



                    data.update({ Announcements: false }).then(async () => {


                        const data1 = await Database.read(`${message.guildId}`);

                        await i.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Leveling")
                                    .setDescription("Leveling Announcements Disabled")
                                    .setColor(client.color)
                            ], ephemeral: true
                        }).then(async () => {
                            const embed = new EmbedBuilder()
                                .setTitle("Leveling")
                                .setDescription("Configure your leveling announce settings\nFor Settuping Up The Announce Embed You May Use `level-announce-embed`")
                                .setColor(client.color)
                                .addFields(
                                    {
                                        name: "Toggle",
                                        value: data1.Announcements ? "Enabled" : "Disabled"
                                    },
                                    {
                                        name: "Channel",
                                        value: data1.AnnounceChannel ? `<#${data1.AnnounceChannel}>` : "Not Set"
                                    },
                                    {
                                        name: "Message",
                                        value: data1.AnnounceMessage ? data1.AnnounceMessage : "Not Set"
                                    }
                                )
                                .setTimestamp()

                            await msg.edit({ embeds: [embed] })
                        })



                    })



                } else if (!data.Announcements) {

                    data.update({ Announcements: true }).then(async () => {

                        const data1 = await Database.read(`${message.guildId}`);
                        await i.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Leveling")
                                    .setDescription("Leveling Announcements Enabled")
                                    .setColor(client.color)
                            ], ephemeral: true
                        }).then(async () => {
                            const embed = new EmbedBuilder()
                                .setTitle("Leveling")
                                .setDescription("Configure your leveling announce settings\nFor Settuping Up The Announce Embed You May Use `level-announce-embed`")
                                .setColor(client.color)
                                .addFields(
                                    {
                                        name: "Toggle",
                                        value: data1.Announcements ? "Enabled" : "Disabled"
                                    },
                                    {
                                        name: "Channel",
                                        value: data1.AnnounceChannel ? `<#${data1.AnnounceChannel}>` : "Not Set"
                                    },
                                    {
                                        name: "Message",
                                        value: data1.AnnounceMessage ? data1.AnnounceMessage : "Not Set"
                                    }
                                )
                                .setTimestamp()

                            await msg.edit({ embeds: [embed] })

                        })



                    })


                }


            }
            if (i.customId === "channel") {


                await i.deferUpdate();

                await i.followUp({ embeds: [new EmbedBuilder().setDescription("Mention A Text Channel in Chat in next 5 min ").setColor(client.color)], ephemeral: true }).then((message) => {
                    const filterMessage = (m) =>
                        m.author.id === i.user.id && !m.author.bot;
                    i.channel
                        .awaitMessages({
                            filterMessage,
                            max: 1,
                            time: 300000,
                            errors: ["time"],
                        })
                        .then(async (collected) => {

                            const channel = collected.first().mentions.channels.first();
                            if (!channel) return message.reply({ content: "Please Mention A  Valid Text Channel" });

                            await data.update({ AnnounceChannel: channel.id }).then(async () => {

                            })
                            const data1 = await Database.read(`${message.guildId}`);
                            await i.followUp({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("Leveling")
                                        .setDescription(`Leveling Announcements Channel Set To ${channel}`)
                                        .setColor(client.color)
                                ], ephemeral: true
                            })

                            const embed = new EmbedBuilder()
                                .setTitle("Leveling")
                                .setDescription("Configure your leveling announce settings\nFor Settuping Up The Announce Embed You May Use `level-announce-embed`")
                                .setColor(client.color)
                                .addFields(
                                    {
                                        name: "Toggle",
                                        value: data1.Announcements ? "Enabled" : "Disabled"
                                    },
                                    {
                                        name: "Channel",
                                        value: data1.AnnounceChannel ? `<#${data1.AnnounceChannel}>` : "Not Set"
                                    },
                                    {
                                        name: "Message",
                                        value: data1.AnnounceMessage ? data1.AnnounceMessage : "Not Set"
                                    }
                                )
                                .setTimestamp()
                            await msg.edit({ embeds: [embed] })



                            await collected.delete({
                                timeout: 1000
                            });



                        });
                });
            } else if (i.customId === "message") {
                await i.deferUpdate();

                await i.followUp({
                    embeds: [new EmbedBuilder().setDescription(`Send A Level Up Message in Chat in next 5 min\n You Can Send "None" To Disable The Message And The Embed Will Be Sent Instead
                
**Variables**
\`\`\`yaml
{user} - User Mention
{user:tag} - User Tag
{user:id} - User ID
{user:username} - User Username
{level} - User Level
{guild} - Guild Name
{guild:id} - Guild ID
\`\`\`
                `).setColor(client.color)], ephemeral: true
                }).then((message) => {
                    const filterMessage = (m) =>
                        m.author.id === i.user.id && !m.author.bot;
                    i.channel
                        .awaitMessages({
                            filterMessage,
                            max: 1,
                            time: 300000,
                            errors: ["time"],
                        })
                        .then(async (collected) => {

                            const msg2 = collected.first().content;
                            if (!msg2) return message.reply({ content: "Please Send A  Valid Message" });

                            await data.update({ AnnounceMessage: msg2 }).then(async () => {

                            })
                            const data1 = await Database.read(`${message.guildId}`);
                            await i.followUp({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("Leveling")
                                        .setDescription(`Leveling Announcements Message Set To ${msg2}`)
                                        .setColor(client.color)
                                ], ephemeral: true
                            })

                            const embed = new EmbedBuilder()
                                .setTitle("Leveling")
                                .setDescription("Configure your leveling announce settings\nFor Settuping Up The Announce Embed You May Use `level-announce-embed`")
                                .setColor(client.color)
                                .addFields(
                                    {
                                        name: "Toggle",
                                        value: data1.Announcements ? "Enabled" : "Disabled"
                                    },
                                    {
                                        name: "Channel",
                                        value: data1.AnnounceChannel ? `<#${data1.AnnounceChannel}>` : "Not Set"
                                    },
                                    {
                                        name: "Message",
                                        value: data1.AnnounceMessage ? data1.AnnounceMessage : "Not Set"
                                    }
                                )
                                .setTimestamp()
                            await msg.edit({ embeds: [embed] })
                            collected.delete({
                                timeout: 1000
                            });



                        });
                })
            } else if (i.customId === "done") {
                await i.deferUpdate();
                await i.followUp({ embeds: [new EmbedBuilder().setDescription("Saved").setColor(client.color)], ephemeral: true })
                msg.edit({ components: [] })
                collector.stop();
            }

        })




    }
};