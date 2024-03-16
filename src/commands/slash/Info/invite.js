            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("invite")
                    .setDescription("Invite Aayu To Your Server"),
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
                    const Buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Invite me!')
                    .setURL(`https://s.aayubot.me/invite`),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Support server')
                    .setURL(`https://s.aayubot.me/support`)
                    
            );

            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setColor(client.color)
            .setFooter({ text: `Aayu 💕 By ${client.users.cache.get("1051806381461745664").username}`, iconURL: `${client.users.cache.get("1051806381461745664").displayAvatarURL()}` })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`> Aayu, a multipurpose Discord bot, brings anime magic to your server with dynamic playlists, detailed stats, and nonstop anime jams. Add Aayu for an epic experience!`)
                                
            interaction.reply({
                embeds: [embed],
                components: [Buttons]
            })
                                   
                }
            };