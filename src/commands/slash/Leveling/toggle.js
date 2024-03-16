            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Database = require("../../../handlers/xata").getXataClient().db.Level;
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("level-toggle")
                    .setDescription("enable/disable the text leveling system"),
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
                                   
                    const data = await Database.read(`${interaction.guildId}`);
                    
                    if( !data || data.Toggle === false || !data.Toggle) {
                    
                    
                    if (!data){            
                        
                        await Database.create({
                            id: interaction.guildId,
                            Toggle: true
                        })
                        
                    } else {
                        data.update({
                            Toggle: true
                        });
                    }
                        interaction.reply({ embeds: [
                            new EmbedBuilder()
                            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                            .setTitle("Leveling")
                            .setDescription("Leveling System Has been enabled\n\nYour Next Tasks Can Be `level-announce` and `level-rewards`")
                            .setColor(client.color)
                        ]})
                    
                    } else if(data.Toggle === true) {
                        data.update({
                            Toggle: false
                        });
                        interaction.reply({ embeds: [
                            new EmbedBuilder()
                            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                            .setTitle("Leveling")
                            .setDescription(`Leveling System Has been disabled`)
                            .setColor(client.color)
                        ]})
                    }
                }
            };