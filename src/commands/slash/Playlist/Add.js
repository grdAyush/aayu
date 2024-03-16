            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder,
                ButtonBuilder, 
                ButtonStyle,
                ActionRowBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");   
            const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;    
            const ptracks = []                                               
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlist-add")
                    .setDescription("add a song to a playlist")
                    .addStringOption(option => option.setName("song").setDescription("song to add").setRequired(true)),
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
                                   
                    const song = interaction.options.getString("song");
                   
               interaction.reply({
                components: [
                    client.load
                ]
                    })
            
                    const playlist = await Playlist.filter({
                        owner: interaction.user.id
                    }).getAll();
            
                    if(!playlist.length) return interaction.editReply({content: "You dont have any playlists", components: []});
                    const res =  await client.riffy.resolve({ query: song, requester: interaction.member })
                    if(res.loadType === "empty") return interaction.editReply({content: "No matches found", components: []});
                    if(res.loadType === "error") return interaction.editReply({content: "Failed to load song", components: []});
                    if(res.loadType === 'playlist' || res.loadType === "search" || res.loadType === "track")  {
                        let i = 0;
                        let buttons = [];
                        let rows = [];
                        let desc = "";
                        for(const pl of playlist) {
                            i++;
                            if(i > 5) break;
                            desc += `\`${i}\` - ${pl.name}\n`;
                            buttons.push(
                                new ButtonBuilder()
                                .setCustomId(`add_${pl.id}`)
                                .setLabel(pl.name)
                                .setStyle(ButtonStyle.Primary)
                            );
                            if(i % 5 === 0) {
                                rows.push(
                                    new ActionRowBuilder()
                                    .addComponents(buttons)
                                );
                                buttons = [];
                            }
                        }
                
                        if(buttons.length) {
                            rows.push(
                                new ActionRowBuilder()
                                .addComponents(buttons)
                            );
                        }
                
                        const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(desc);
                
                        const msg = await interaction.editReply({content: "Please select a playlist to add the song to", embeds: [embed], components: rows});
                
                        const filter = (i) => i.user.id === interaction.user.id;
                        const collector = msg.createMessageComponentCollector({filter, time: 60000});
                
                        collector.on("collect", async i => {
                            i.deferUpdate();
                            if(i.customId.startsWith("add++")) {
                                const id = i.customId.split("++")[1];
                                const pl = await Playlist.raed(id);
                                if(!pl) return i.followUp({content: "Playlist not found", components: []});
                                if(pl.owner !== interaction.user.id) return i.followUp({content: "You dont own this playlist", components: []});
                               if(res.loadType === 'playlist') {


                                i.followUp({content: "Adding Songs To The Playlist\n\n You Can Check Your Playlist After Sometime", components: [client.load]});
                                                                for (let i = 0; i < res.tracks.length; i++) {
                                    ptracks.push(`${res.tracks[i].info.title} By ${res.tracks[i].info.author}`)
                                 }  
     
                                 ptracks.push(...pl.tracks)
                                 await pl.update({
                                     tracks: ptracks
                                 });
     
                           
                            
                            } else if(res.loadType === "search" || res.loadType === "track") {
                                    i.followUp({content: "Added song to playlist", components: []});
                                    const track = res.tracks.shift();
                                    await pl.update({
                                        tracks: [...pl.tracks, `${track.info.title} By ${track.info.author}`]
                                    });

                                   

                                }
                            }})}

                }
            };