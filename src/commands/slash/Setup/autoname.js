            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Autoname = require("../../../handlers/xata").getXataClient().db.Autoname;
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("autoname")
                    .setDescription("setup the autoname system in the guild")
                    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
                    .addSubcommand(subcommand => subcommand
                        .setName("set")
                        .setDescription("set the autoname")
                        .addStringOption(option => option
                            .setName("name")
                            .setDescription("the name to set use <user> for usermame")
                            .setRequired(true)
                        )
                        )
                        .addSubcommand(subcommand => subcommand
                            .setName("disable")
                            .setDescription("disable the autoname system")
                        )
                        .addSubcommand(subcommand => subcommand
                            .setName("info")
                            .setDescription("get the info about the autoname system")
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

                    const type = interaction.options.getSubcommand();

                    switch (type) {

                        case "set": {
                            const name = interaction.options.getString("name");

                            if(name.length > 30 ) return interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Autoname")
                                .setDescription(`Name must be less than 30 characters`)
                                .setColor(client.color)
                            ]});

                            const data = await Autoname.read(`${interaction.guildId}`);
                            if(data) {
                                data.update({
                                    Name: name,
                                    Toggle: true
                                });
                            } else {
                                await Autoname.create({
                                    id: interaction.guildId,
                                    Name: name,
                                    Toggle: true
                                });
                            }

                            interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Autoname")
                                .setDescription(`Autoname Has been setuped Now Anyone Join The Server Will Be Named ${name.replace(/<user>/g, interaction.user.username)}`)
                                .setColor(client.color)
                            ]})

                            break;
                        }
                        case "disable": {
                            const data = await Autoname.read(`${interaction.guildId}`);
                            if(!data) return interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Autoname")
                                .setDescription(`Autoname is not setuped`)
                                .setColor(client.color)
                            ]});
                            data.update({
                                Toggle: false
                            });
                            interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Autoname")
                                .setDescription(`Autoname Has been disabled`)
                                .setColor(client.color)
                            ]});
                            break;
                        }
                        case "info": {
                            const data = await Autoname.read(`${interaction.guildId}`);
                            if(!data) return interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Autoname")
                                .setDescription(`Autoname is not setuped`)
                                .setColor(client.color)
                            ]});
                            interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setTitle("Autoname")
                                .setDescription(`Autoname is setuped and the name is ${data.Name.replace(/<user>/g, interaction.user.username)}`)
                                .setColor(client.color)
                            ]});
                            break;
                        }
                    }


                                   
                }
            };