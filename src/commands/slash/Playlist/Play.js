            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;                                                                   
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlist-play")
                    .setDescription("play the playlist").addStringOption(
                        option=> option.setName("playlist").setDescription("playlist name which you ant to play (public or private)").setRequired(true)
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

                    interaction.deferReply();
                    const Pname = interaction.options.getString("playlist")




                    let playlist = await Playlist.filter({
                        name: Pname,
                        owner: interaction.author.id
                    }).getFirst()
            
                    if(!playlist) {
                playlist = await Playlist.filter({
                    name: Pname,
                    Private: false
                }).getFirst()
                  }
            
            
                  if(!playlist) return interaction.editReply({ content: "Could not Find That Playlist"})
                  
            
                  const { channel } = interaction.member.voice;
                  if (!channel) return interaction.editReply( { content: `You are not in a voice channel`, components: []});
                  if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.Connect)) return interaction.channel.send(`I don't have permission to join your voice channel!`);
                  if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.Speak)) return interaction.channel.send(`I don't have permission to speak in your voice channel!`);
              
                  let player = client.riffy.players.get(interaction.guild.id)
                  if(!player){
                   player = await client.riffy.createConnection({
                      guildId: interaction.guild.id,
                      voiceChannel: channel.id,
                      textChannel: interaction.channel.id,
                      deaf: true,
                  });}
            
            
            
                  for( i of playlist.tracks) {
                    const res =  await client.riffy.resolve({ query: i, requester: interaction.member })
            
                    const { loadType, tracks, playlistInfo } = res;
            
                    if (loadType === 'search' || loadType === 'track') {
                        const trackToAdd = tracks.shift();
                        trackToAdd.info.requester = interaction.member;
            
                        
                        if (!player.queue.includes(trackToAdd)) {
                            player.queue.add(trackToAdd);
                            if (!player.playing && !player.paused) player.play();
                        }
                    } else {
                        //interaction.channel.send({ content: `Error Playing ${track}` });
                    }
                  }
            
            
                  interaction.editReply({ components: [], embeds: [
                    new EmbedBuilder()
                    .setDescription(`Queued **${playlist.name}**`)
                    .setColor(client.color)
                  ]})
            
            
            
            
            
            
            
                                   
                }
            };