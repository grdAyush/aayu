
const { Player } = require("riffy")
const ExtendedClient = require('../../class/ExtendedClient');
const Player2 = require("../../handlers/xata").getXataClient().db.Player;
/**
 * 
 * @param {ExtendedClient} client
 * @param {Player} player
 */

module.exports = async (client, player) => {
  
    const Mdata = await Player2.read(player.guildId);
    
    if(Mdata) {
    const guild = client.guilds.cache.get(player.guildId);
    console.log("[Riffy] Player Disconnected  in Guild: " + `${player.guildId} (${guild.name})`);
  const ch =   guild.channels.cache.get(Mdata.Text);

   const message = await  ch.messages.fetch(Mdata.Message);

   if (message) {
message.delete().catch(err=> {});
   }

    Mdata.delete()
    }
}