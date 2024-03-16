const { Message, PermissionFlagBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;
const ptracks = []
module.exports = {
    structure: {
        name: 'playlist-add',
        description: 'add a song to a playlist',
        aliases: ["pla", "add-playlist", "addpl", "pl-add", "pladd", "addp"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {


        const song = args.join(" ");
        if(!song) return message.channel.send("Please provide a song to add to the playlist");

        const lmsg = message.reply({
            components: [
                client.load
            ]
        })

        const playlist = await Playlist.filter({
            owner: message.author.id
        }).getAll();

        if(!playlist.length) return (await lmsg).edit({ content: "You don't have any playlist", components: [] });
        const res =  await client.riffy.resolve({ query: song, requester: message.member })
        if(res.loadType === "empty") return (await lmsg).edit({ content: "No matches found", components: [] });
        if(res.loadType === "error") return (await lmsg).edit({ content: "Failed to load song", components: [] });
        if(res.loadType === 'playlist' || res.loadType === "search" || res.loadType === "track")  {
            let i = 0;
            let buttons = [];
            let rows = [];
            let desc = "";
            for(const pl of playlist) {
                i++;
                if(i > 5) break;
                desc += `In Which Playlist You Want To Add This Song\n\n\`${i}\` - ${pl.name}\n`;
                buttons.push(
                    new ButtonBuilder()
                    .setCustomId(`add++${pl.id}`)
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
            .setDescription(`${desc}`)
            .setTimestamp()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL()});
            const msg = (await lmsg).edit({ embeds: [embed], components: rows });

            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector =(await msg).createMessageComponentCollector({filter, time: 60000});
          
            if(res.loadType === 'playlist') {

                collector.on("collect", async (interaction) => {
                    interaction.deferUpdate();
                    if(interaction.customId.startsWith("add++")) {
                        const id = interaction.customId.split("++")[1];
                        const pl = await Playlist.read(id);
                        if(!pl) return interaction.followUp("Failed to load playlist");
                        
                       


                           
                                                            for (let i = 0; i < res.tracks.length; i++) {
                                    ptracks.push(`${res.tracks[i].info.title} By ${res.tracks[i].info.author}`)
                                 }  
     
                                 ptracks.push(...pl.tracks)
                                 await pl.update({
                                     tracks: ptracks
                                 });
     

                          
                      
                        interaction.followUp("Added songs to playlist");
                    }
                });
            } else if (res.loadType === "search" || res.loadType === "track") {
               
                collector.on("collect", async (interaction) => {
                    interaction.deferUpdate();
                    if(interaction.customId.startsWith("add++")) {
                        const id = interaction.customId.split("++")[1];
                        console.log(id);
                        const pl = await Playlist.read(id);
                        if(!pl) return interaction.followUp("Failed to load playlist");
                        let track = res.tracks.shift();

                      await pl.update({
                            tracks: [...pl.tracks, `${track.info.title} By ${track.info.author}`]
                        });
                        interaction.followUp("Added song to playlist");
                    }
                });
            }
    
            
        } else {
            return message.channel.send("Failed to load song");
        }
        

     
        
        
    }
};