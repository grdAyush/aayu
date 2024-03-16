const { Player, Track } = require("riffy")
const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder, VoiceChannel } = require("discord.js")
/**
 * 
 * @param {ExtendedClient} client 
 * @param {Player} player 
 * @param {VoiceChannel} oldchannel 
 * @param {VoiceChannel} newchannel 
 */
module.exports = async(client, player, oldchannel, newchannel) => {
   
    const guild = client.guilds.cache.get(player.guildId)
    if(!guild) return;

    const channel = guild.channels.cache.get(player.textChannel);
    if (!channel) return;


    if(oldchannel === newchannel) return;
    if(newchannel === null || !newchannel) {
    if(!player) return;
    player.destroy();
  } else {
    player.setVoiceChannel(newchannel);
    player.destroy();
  }
}