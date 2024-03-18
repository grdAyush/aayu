const ExtendedClient = require('../../class/ExtendedClient');
const { Node } = require('riffy');
const { log } = require("../../functions");
const { EmbedBuilder } = require('discord.js');
const Guild = require("../../handlers/xata").getXataClient().db.GuildSchema;
const Player = require("../../handlers/xata").getXataClient().db.Player;
/**
 * @param {ExtendedClient} client 
 * @param {Node} node 
 */
module.exports = async(client, nodes) => {
log("Node:" + nodes.name + " connected", "done")
client.guilds.cache.forEach(async (guild) => {
    try {
      const Mdata = await Player.read(guild.id)
           if(!Mdata) return;
    
           const vch = await guild.channels.cache.get(Mdata.Voice)
    
           if(!vch) {
            await Mdata.delete();
           }

           
           const members = vch.members.filter(m => !m.user.bot) 
           const Data = await Guild.read(guild.id)
            if(!Data && members.size == 0 || !Data.TwentyFourSeven && members.size == 0) {
               await Mdata.delete();
              return;
            
            }
    
           const player = await client.riffy.createConnection({
            guildId: guild.id,
            voiceChannel: vch.id,
            deaf: true,
        });
    
        const ch = await guild.channels.cache.get(Mdata.Text)

        if (ch) {
          player.setTextChannel(ch.id)
          ch.send({ embeds: [ new EmbedBuilder().setThumbnail("https://images-ext-2.discordapp.net/external/rHlRfsr8bka2VRTE1q7Fl_1sza21viTsjsiJbCHvbRk/https/cdn.discordapp.com/emojis/1192392279936221195.gif").setDescription(" **Reboot Completed ✅**\nI am Back Guys, Play the songs and let the party continue").setColor(client.color)]})
        }
    
        console.log(`[Player] Reconnected in ${guild.id}`)
    } catch (error) {
      console.log(`[Player] Coudn't Reconect in ${guild.id}\n\n${error}`)
    }
               
              }
              )
}