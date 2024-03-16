            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
        const GuildSchema = require("../../../handlers/xata").getXataClient().db.GuildSchema;                                                 
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("247")
                    .setDescription("Enable / Disable 24/7 mode")
                    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
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
                    if (!player) return interaction.reply(`I am Not Playing Right Now`);
                    const { channel } = interaction.member.voice;
                    if (!channel) return interaction.reply(`You are not in a voice channel`);
                    if(interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);
                    let Data = await GuildSchema.read(`${interaction.guild.id}`);
                    if(!Data) {
                        Data = await  GuildSchema.create({
                            id: interaction.guild.id
                        })
                    }
                    if(Data.TwentyFourSeven == true){
                        Data.update({
                            TwentyFourSeven: false
                        
                        })
                        
            const embed = new EmbedBuilder()
            .setDescription("`🌙` | *Mode 24/7 has been:* `Deactivated`")
            .setColor(client.color);
                        return interaction.reply({ embeds: [embed] });
                    } else {
                       Data.update({
                            TwentyFourSeven: true
                       })
                        const embed = new EmbedBuilder()
                        .setDescription("`🌕` | *Mode 24/7 has been:* `Activated`")
                        .setColor(client.color);
                        return interaction.reply({ embeds: [embed] });
                    }



                }
            };