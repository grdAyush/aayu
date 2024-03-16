            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder,
                PermissionsBitField,
                EmbedBuilder
            } = require("discord.js");
            const { convertTime } = require("../../../../structures/ConvertTime");

            const ExtendedClient = require("../../../class/ExtendedClient");
                                                       
           module.exports = {
            
               structure: new SlashCommandBuilder()
                    .setName("play")
                    .setDescription("play music")
                    .addStringOption(option => option
                    .setName("search")
                    .setRequired(true)
       
                    .setDescription("what you want to hear")
                    ),
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

                const { channel } = interaction.member.voice;
                if (!channel) return interaction.reply(`You are not in a voice channel`);
                if (!channel.joinable) return interaction.reply(`I can't join your voice channel!`);
                if (!channel.speakable) return interaction.reply(`I can't speak in your voice channel!`);
                if (channel.userLimit && channel.members.size >= channel.userLimit) return interaction.reply(`Your voice channel is full!`);
                if(interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.reply(`I don't have permission to join your voice channel!`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.reply(`I don't have permission to speak in your voice channel!`);
        
                await interaction.reply(`🔍 **Searching...** \`${interaction.options.getString("search")}\``);

           const player = await client.riffy.createConnection({
                    guildId: interaction.guild.id,
                    voiceChannel: channel.id,
                    textChannel: interaction.channel.id,
                    deaf: true,
                })

                const string = interaction.options.getString("search");
                const res = await client.riffy.resolve({ query: string, requester: interaction.member })

                const { loadType, tracks, playlistInfo } = res;

                if (loadType === 'playlist') {
                    for (const track of tracks) {
                        track.info.requester = interaction.member;
                        player.queue.add(track);
                    }

                    if (!player.playing && !player.paused) player.play();
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Queued • ${playlistInfo.name} • ${tracks[0].info.requester}**`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                } else if (loadType === 'search' || loadType === 'track') {
             const track = tracks.shift();
            track.info.requester = interaction.member;

            player.queue.add(track);

            if (!player.playing && !player.paused) player.play();
            const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Queued**: \`${track.info.title}\``)
                

                interaction.editReply({ content: " ",  embeds: [embed]})

                                   
                } else {
                    return interaction.editReply(`No results found for \`${string}\``);
                }
            }
            };