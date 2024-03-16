            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, AttachmentBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const formatDuration = require("../../../../structures/FormatDuration.js");
            const { musicCard } = require("musicard-bun");

                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("nowplaying")
                    .setDescription("see the current playing song info"),
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
                    if(interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);
                    const player = client.riffy.players.get(interaction.guild.id);
                    await interaction.deferReply();
            
                    const song = player.current;
                    const CurrentDuration = formatDuration(player.position);
                    const TotalDuration = formatDuration(song.info.length);
            
                    const Themes = [
                        "space",
                        "space+",
                        "anime",
                        "classic"
                    ]
                    const card = new musicCard()
                    .setAuthor(song.info.author)
                    .setName(song.info.title)
                    .setBrightness(100)
                    .setColor("auto")
                    .setEndTime(TotalDuration)
                    .setStartTime(CurrentDuration)
                    .setProgress(player.position / song.info.length * 100)
                    .setTheme(Themes[Math.floor(Math.random() * Themes.length)])
                    .setThumbnail(song.info.thumbnail || client.user.displayAvatarURL())
                    
             await card.build().then((buffer) => {
                    const attachment = new AttachmentBuilder(buffer, { name: "music.png"});
            
                    
                    if (!player) return message.reply(`I am Not Playing Right Now`);
                    const embed = new EmbedBuilder()
                    .setAuthor({ name: player.playing ? `Now playing...` : `Song paused`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
                        .setColor(client.color)
                        .addFields({ name: `Requester:`, value: `${song.info.requester}`, inline: true })
                        .addFields({ name: `Volume:`, value: `${player.volume}%`, inline: true })
                        .addFields({ name: `Queue Length:`, value: `${player.queue.length}`, inline: true })
                        .setImage("attachment://music.png")
                        .setTimestamp();
            
            
           interaction.editReply({ embeds: [embed], files: [attachment]})
                  })                       
                                   
                }
            };