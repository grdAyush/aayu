const { Message, PermissionFlagBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const AayuEmbed = require("../../../Embed/Embed")
const Database = require("../../../handlers/xata").getXataClient().db.Level;
const axios = require('axios');

module.exports = {
    structure: {
        name: 'level-announce-embed',
        description: 'setup announce embed for level up',
       aliases: ["lae"],
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

      

            let row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("embedSelect")
                .setPlaceholder("Nothing selected")
                .addOptions([{
                    emoji: "✏️",
                    label: "Title",
                    description: "Create a embed title",
                    value: "title_embed",
                },
                    {

                        emoji: "✏️",

                        label: "Title Url",

                        description: "Create a embed title Url",

                        value: "title_url",

                    },
                    {
                        emoji: "💬",
                        label: "Description",
                        description: "Create a embed description",
                        value: "description_embed",
                    },
                    {
                        emoji: "🕵️",
                        label: "Author",
                        description: "Create a embed author",
                        value: "author_embed",
                    },
                    {

                        emoji: "🕵️",

                        label: "Author Image",

                        description: "Create a embed author images",

                        value: "author_image",

                    },
                    {
                        emoji: "🔻",
                        label: "Footer",
                        description: "Create a embed footer",
                        value: "footer_embed",
                    },
                    {

                        emoji: "🔻",

                        label: "Footer Image",

                        description: "Create a embed footer image",

                        value: "footer_image",

                    },
                    {
                        emoji: "🔳",
                        label: "Thumbnail",
                        description: "Create a embed thumbnail",
                        value: "thumbnail_embed",
                    },
                    {
                        emoji: "🕙",
                        label: "Timestamp",
                        description: "Create a embed timestamp",
                        value: "timestamp_embed",
                    },
                    {
                        emoji: "🖼️",
                        label: "Image",
                        description: "Create a embed image",
                        value: "image_embed",
                    },
                    {
                        emoji: "🔵",
                        label: "Color",
                        description: "Create a embed color",
                        value: "color_embed",
                    },
                ])
            );

            let row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("send_embed")
                .setLabel("Save Embed")
                .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                .setCustomId("aayu-format")
                .setLabel("Aayu Embed Format")
                .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                .setCustomId("raw-json")
                .setLabel("JSON")
                .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                .setCustomId("thumnail")
                .setLabel("Embed Thumbnail")
                .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                .setCustomId("cancel")
                .setEmoji(client.emoji.delete)
                .setStyle(ButtonStyle.Danger)
            );
            let rowb = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("embed-toggle")
                .setLabel("Embed Toggle")
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setLabel("Embed Builder")
                .setURL('https://www.aayubot.me/embed-visualizer.html')
                .setStyle(ButtonStyle.Link)
            );

            let embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Some title')
            .setURL('https://s.aayubot.me/support')
            .setDescription('Some description here')
            .setThumbnail('https://cdn.discordapp.com/avatars/1051806381461745664/f39828e0fc358084e82fb9582bef1fc1.png')
            .setTimestamp();


     const msg = await message.reply({
                embeds: [embed], components: [row, row2, rowb]
            });

            const VariableEmbed = message.channel.send({ embeds: [new EmbedBuilder().setDescription(`
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
                            `).setColor(client.color)]})

            const filter = (i) => i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({
                filter,
            });

            collector.on("collect", async (i) => {
                if (i.customId === "embedSelect") {
                    i.deferUpdate();

                    if (i.values == "title_embed") {
                        message.channel
                        .send({
                            content: "Please enter a title"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });

                                collected.delete({
                                    timeout: 1000
                                });

                                embed.setTitle(`${collected.first().content}`);
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }
                    if (i.values == "title_url") {
                        message.channel
                        .send({
                            content: "Please enter a url"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });
                                collected.delete({
                                    timeout: 1000
                                });

                                if (
                                    !collected.first().content.includes("http://") &&
                                    !collected.first().content.includes("https://")
                                )
                                    return message.channel.send({
                                    content: "Incorrect url!",
                                });
                                embed.setURL(`${collected.first().content}`);
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }

                    if (i.values == "description_embed") {
                        message.channel
                        .send({
                            content: "Please enter a description"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });
                                collected.delete({
                                    timeout: 1000
                                });

                                embed.setDescription(`${collected.first().content}`);
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }

                    if (i.values == "author_embed") {
                        message.channel
                        .send({
                            content: "Please enter a author"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });
                                collected.delete({
                                    timeout: 1000
                                });

                                embed.setAuthor({
                                    name: `${collected.first().content}`

                                });
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }
                    if (i.values == "author_image") {

                        message.channel

                        .send({
                            content: "Please enter a url"
                        })

                        .then((message2) => {

                            const filterMessage = (m) =>

                            m.author.id === message2.author.id && !m.author.bot;

                            message2.channel

                            .awaitMessages({

                                filterMessage,

                                max: 1,

                                time: 300000,

                                errors: ["time"],

                            })

                            .then(async (collected) => {

                                message2.delete({
                                    timeout: 1000
                                });

                                collected.delete({
                                    timeout: 1000
                                });

                                if (

                                    !collected.first().content.includes("http://") &&

                                    !collected.first().content.includes("https://")

                                )

                                    return message2.channel.send({

                                    content: "Incorrect url!",

                                });

                                embed.setAuthor({
                                    iconUrl: `${collected.first().content}`
                                });

                                await msg.edit({
                                    embeds: [embed]
                                });

                            });

                        });

                    }

                    if (i.values == "footer_embed") {
                        message.channel
                        .send({
                            content: "Please enter a footer"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });
                                collected.delete({
                                    timeout: 1000
                                });

                                embed.setFooter({
                                    text: `${collected.first().content}`,
                                });
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }
                    if (i.values == "footer_image") {

                        message.channel

                        .send({
                            content: "Please enter a url"
                        })

                        .then((message2) => {

                            const filterMessage = (m) =>

                            m.author.id === message2.author.id && !m.author.bot;

                            message2.channel

                            .awaitMessages({

                                filterMessage,

                                max: 1,

                                time: 300000,

                                errors: ["time"],

                            })

                            .then(async (collected) => {

                                message2.delete({
                                    timeout: 1000
                                });

                                collected.delete({
                                    timeout: 1000
                                });

                                if (

                                    !collected.first().content.includes("http://") &&

                                    !collected.first().content.includes("https://")

                                )

                                    return message2.channel.send({

                                    content: "Incorrect url!",

                                });

                                embed.setFooyer({
                                    iconUrl: `${collected.first().content}`
                                });

                                await msg.edit({
                                    embeds: [embed]
                                });

                            });

                        });

                    }

                    if (i.values == "thumbnail_embed") {
                        message.channel
                        .send({
                            content: "Please enter a thumbnail"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });
                                collected.delete({
                                    timeout: 1000
                                });

                                if (
                                    !collected.first().content.includes("http://") &&
                                    !collected.first().content.includes("https://")
                                )
                                    return message2.channel.send({
                                    content: "Incorrect thumbnail link!",
                                });
                                embed.setThumbnail(`${collected.first().content}`);
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }

                    if (i.values == "thumbnail_embed") {
                        embed.setTimestamp();
                        msg.edit({
                            embeds: [embed]
                        });
                    }

                    if (i.values == "image_embed") {
                        message.channel
                        .send({
                            content: "Please enter a image"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });
                                collected.delete({
                                    timeout: 1000
                                });

                                if (
                                    !collected.first().content.includes("http://") &&
                                    !collected.first().content.includes("https://")
                                )
                                    return message2.channel.send({
                                    content: "Incorrect image link!",
                                });
                                embed.setImage(`${collected.first().content}` || null);
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }



                    if (i.values == "color_embed") {
                        message.channel
                        .send({
                            content: "Please enter a color. e.g. #FF0000"
                        })
                        .then((message2) => {
                            const filterMessage = (m) =>
                            m.author.id === message2.author.id && !m.author.bot;
                            message2.channel
                            .awaitMessages({
                                filterMessage,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .then(async (collected) => {
                                message2.delete({
                                    timeout: 1000
                                });
                                collected.delete({
                                    timeout: 1000
                                });

                                embed.setColor(`${collected.first().content}`);
                                await msg.edit({
                                    embeds: [embed]
                                });
                            });
                        });
                    }
                } else
                if (i.customId == "send_embed") {
                    (await VariableEmbed).delete()
                  
                    data.update({
                        AnnounceEmbed: i.message.embeds[0]
                    })

                    message.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle("Leveling")
                            .setDescription("Embed has been saved")
                            .setColor(client.color)
                        ]
                    })

                    msg.edit({ components: []})

                    collector.stop();
                } else if (i.customId == "aayu-format") {

                    i.deferUpdate();


                   message.channel.send({ content: "Please Send Embed Format Of Aayu Which You Copied From [Here](https://www.aayubot.me/embed-visualizer.html)" }).then((message2) => {
                        const filterMessage = (m) =>
                        m.author.id === message2.author.id && !m.author.bot;
                        message2.channel
                        .awaitMessages({
                            filterMessage,
                            max: 1,
                            time: 300000,
                            errors: ["time"],
                        })
                        .then(async (collected) => {

                            const content = collected.first().content;

                            const argsArray = content.split(/\s+/);
                        let { embed, success, fails } = AayuEmbed(argsArray)

                        if(!embed) return message.channel.send({ content: "Invalid Embed Format" }),   console.error('Error building embed:', { success, fails }) 

                        msg.edit({ embeds: [embed] }).then(() => {
                            i.followUp({ content: "Embed Has Been Set", ephemeral: true })
                        })

                        collected.delete({
                            timeout: 1000
                        });

                        });
                    });
                   
                } else if(i.customId == "raw-json") {

                    i.deferUpdate();

                    message.channel.send({ content: `Paste A Json Here or You Can Send a raw Json Link of Embed You Can USe [Github](https://github.com), [Pastebin](https://pastebin.com) or any other site that gives json. You Can Build Json On [Here](https://www.aayubot.me/embed-visualizer.html) . You can Also Send Attachment of file` }).then((message2) => {
                        const filterMessage = (m) =>
                        m.author.id === message2.author.id && !m.author.bot;
                        message2.channel
                        .awaitMessages({
                            filterMessage,
                            max: 1,
                            time: 300000,
                            errors: ["time"],
                        })
                        .then(async (collected) => {

                            const content = collected.first().content;

                            if(content.startsWith("https://") || content.startsWith("http://")) {
                                const data = await fetchUrl(content)

                                if(!data) return message.channel.send({ content: "Invalid Json Link" })

                                const embed = new EmbedBuilder(data)

                                msg.edit({ embeds: [embed] }).then(() => {
                              
                                        i.followUp({ content: "Embed Has Been Set", ephemeral: true })
                              
                                })

                                collected.delete({
                                    timeout: 1000
                                });

                                return;
                            } else if (collected.first().attachments.size > 0) {
                                const attachment = collected.first().attachments.first();
                                const data = await fetchUrl(attachment.url)

                                if(!data) return message.channel.send({ content: "Invalid Json Attachment" })

                                const embed = new EmbedBuilder(data)

                                msg.edit({ embeds: [embed] }).then(() => {
                                    i.followUp({ content: "Embed Has Been Set", ephemeral: true })
                                })

                           message2.delete()

                                collected.delete();

                                return;
                            } else {
                                try {

                                    const parsedJson = JSON.parse(content)

                                    const embed = new EmbedBuilder(parsedJson)

                                    msg.edit({ embeds: [embed] }).then(() => {
                                        i.followUp({ content: "Embed Has Been Set", ephemeral: true })
                                    })


                                } catch (error) {
                                    return message.channel.send({ content: "Invalid Json Text Format" })
                                }
                            }

                        collected.delete({
                            timeout: 1000
                        });

                        });
                    });

                } else if (i.customId == "thumnail") {
                    i.deferUpdate();

                    message.channel.send({ embeds: [
                        new EmbedBuilder()
                        .setDescription(`Which Type Of Thumbnail You Want To Set\n
**Variables**
\`\`\`yaml
guildAvatar - It Will Show Guild Avatar On Levelup
AuthorAvatar - It Will Show User's Avatar Who had Levelup
None - Custom That You Can Set Using DropDown
\`\`\`
`)
                    ]}).then((message2) => {

                        const filterMessage = (m) =>
                        m.author.id === message2.author.id && !m.author.bot;
                        message2.channel
                        .awaitMessages({
                            filterMessage,
                            max: 1,
                            time: 300000,
                            errors: ["time"],
                        })
                        .then(async (collected) => {

                            const content = collected.first().content;

                            if(content.toLowerCase() == "guildavatar") {

                                data.update({
                                    AnnounceThumbnail: "guildAvatar"
                                })

                                i.followUp({ embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Leveling")
                                    .setDescription("Thumbnail Has Been Set To Guild Avatar.  Now It Will Show On The Level Up Embed")
                                    .setColor(client.color)
                                ], ephemeral: true},)

                            } else if (content.toLowerCase() == "authoravatar") {

                                data.update({
                                    AnnounceThumbnail: "AuthorAvatar"
                                })

                               i.followUp({ embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Leveling")
                                    .setDescription("Thumbnail Has Been Set To Author Avatar. Now It Will Show On The Level Up Embed")
                                    .setColor(client.color)
                                ], ephemeral: true})

                            } else if (content.toLowerCase() == "none") {

                                data.update({
                                    AnnounceThumbnail: "None"
                                })

                               i.followUp({ embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Leveling")
                                    .setDescription("Thumbnail Setting Has Been Set To None. Now You Can Set Your Custom Thumnail URL")
                                    .setColor(client.color)
                                ], ephemeral: true})

                            } else {
                                message.channel.send({ content: "Invalid Parameters. The Parameters Should Be   `None`, `AuthorAvatar` or `guildAvatar` " })
                            
                            }})
                    })
                } else if(i.customId == "cancel") {

                    (await VariableEmbed).delete()
                    i.deferUpdate();
                    msg.edit({ components: []})
                    collector.stop();
                } else if (i.customId == "embed-toggle") {
                    i.deferUpdate();
                    const data1 = await Database.read(`${message.guild.id}`);

                    if (data1.AnnounceEmbedToggle === true) {

                        
                      
                        data1.update({
                            AnnounceEmbedToggle: false
                        }).then(() => { 
                            i.followUp({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Leveling")
                                .setDescription(`AnnounceEmbed Has Been disabled`)
                                .setColor(client.color)
                            ], ephemeral: true})
                        
                        })
                    } else {
                        data1.update({
                            AnnounceEmbedToggle: true
                        }).then(() => {
                            i.followUp({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Leveling")
                                .setDescription("AnnounceEmbed Has Been Enabled")
                                .setColor(client.color)
                            ], ephemeral: true})
                        
                        })
                    }
                }
            }
            );

}}

async function fetchUrl(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching commands:', error);
      return null;
    }
  }