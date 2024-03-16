
const { Player } = require("riffy")
const ExtendedClient = require('../../class/ExtendedClient');
const Player1 = require("../../handlers/xata").getXataClient().db.Player;
/**
 * 
 * @param {ExtendedClient} client
 * @param {Player} player
 */

module.exports = async (client, player) => {
const guild = client.guilds.cache.get(player.guildId);
console.log("[Riffy] Player Created in Guild: " + `${player.guildId} (${guild.name})`);
const Mdata = await Player1.read(player.guildId);
  if(!Mdata) { await Player1.create({
    id: player.guildId,
    Voice: player.voiceChannel,
    Text: player.textChannel,
  });}};