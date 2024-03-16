        const { Message, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Data1 = require("../../../handlers/xata").getXataClient().db.GuildSchema;
module.exports = {
    structure: {
        name: 'stop',
        description: 'stop the music',
       aliases: [],
        permissions: null,
  cooldown: 7000,
        category: "Music",
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
                    
                    const { channel } = message.member.voice;
                    if (!channel) return message.reply(`You are not in a voice channel`);
                    const player = client.riffy.players.get(message.guild.id);
                    if (!player) return message.reply(`Song are not playing!`);
                    
                    const Data = await Data1.read(`${message.guild.id}`);

                    if(!Data || !Data.TwentyFourSeven){

                        player.queue.clear();
                        player.stop();
                        player.destroy();

                        const embed = new EmbedBuilder()
                        .setDescription("`📻` | *Music has been:* `Stopped`")
                        .setColor(client.color);
                         

                        message.reply({ embeds: [embed] })

                    } else if(Data.TwentyFourSeven) {
                        player.destroy();

                        const embed = new EmbedBuilder()
                        .setDescription("`📻` | *Music has been:* `Stopped`\n But I have seen That You Have Enabled `24/7` Mode Do You Want Me To Rejoin The Channel")
                        .setColor(client.color);
                        
                        const buttons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Danger)
                        )

                         message.reply({ embeds: [embed], components: [buttons] })

                            const filter = i => i.user.id === message.author.id;
                            const collector =  message.channel.createMessageComponentCollector({ filter });

                            collector.on("collect", async i => {
                                if(i.customId === "yes"){
                                    await i.deferUpdate();
                                    const {channel} = message.member.voice;
                                    if(!channel) return i.reply({ content: `I Think You Leaved The Voice Channel\n\nNo Worries use \`join\` command to rejoin`, ephemeral: true });
                                  await client.riffy.createConnection({
                                        guildId: message.guild.id,
                                        voiceChannel: channel.id,
                                        textChannel: message.channel.id,
                                        deaf: true,
                                    })
                                    i.followUp({ content: `Rejoined The Channel`, ephemeral: true });
                                    i.message.delete();
                                } else if(i.customId === "no"){
                                   await i.deferUpdate()
                                    i.message.delete();
                                

                                }})


    }
    }
}