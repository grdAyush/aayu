            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("queue")
                    .setDescription("see the queue"),
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
                    interaction.deferReply();

                    const player = client.riffy.players.get(interaction.guildId);
                    if (!player) return interaction.editReply(`I am Not Playing Right Now`);
                    const queue = player.queue;
                    if(!queue || player.queue.lenght) return interaction.editReply(`There is nothing in the queue`);
                    const pages = Math.ceil(queue.length / itemsPerPage);
                    let currentPage = 1;
            
                    const generateEmbed = () => {
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const currentQueue = queue.slice(startIndex, endIndex);
            
                        const embed = new EmbedBuilder()
                            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                            .setColor(client.color)
                            .setTimestamp()
                            .setDescription(currentQueue.map((track, i) => {
                                return `${startIndex + i + 1}. **${track.info.title}**`;
                            }).join("\n"));
            
                        embed.setFooter({text: `Page ${currentPage}/${pages}`});
            
                        return embed;
                    };
            
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setEmoji("<:previous:1121646915726086225>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setEmoji("<:next:1121646775770558494>")
                                .setStyle(ButtonStyle.Secondary),
                        );
            
                    const messageEmbed = await interaction.editReply({
                        embeds: [generateEmbed()],
                        components: [row],
                    });
            
                    const filter = i => i.customId === 'previous' || i.customId === 'next';
                    const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });
            
                    collector.on('collect', async i => {
                        if (i.customId === 'previous' && currentPage > 1) {
                            currentPage--;
                        } else if (i.customId === 'next' && currentPage < pages) {
                            currentPage++;
                        }
            
                        await i.update({
                            embeds: [generateEmbed()],
                            components: [row],
                        });
                    });
            
                    collector.on('end', collected => {
                        messageEmbed.edit({ components: [] });
                    });
                                   
                }
            };