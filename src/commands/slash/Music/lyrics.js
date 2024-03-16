            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const { Client } = require("genius-lyrics")
            const genius = new Client("eeC4tgK5oHtRGQYOzsHvbtRHYUppV1T1rGIuwM0PNs403rDEqoxtebypuPIUhLNj")
                                                                           
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("lyrics")
                    .setDescription("shows the lyrics of the current song")
                    .addStringOption(option => option.setName("song").setDescription("the song to search for").setRequired(false)),
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

                    const player = client.riffy.players.get(interaction.guild.id);
                const song =  interaction.options.getString("song") || player.current.info.title;

                interaction.deferReply();

    const search = await genius.songs.search(song)

        const lyrics = await search[0].lyrics()

        if(!lyrics) return interaction.editReply({
            content: 'No lyrics found.',
        })

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: search[0].artist.name, iconURL: search[0].image})
            .setTitle(search[0].title)
            .setDescription(lyrics)
          //  .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))

            interaction.editReply({ embeds: [embed] })

                                   
                }
            };