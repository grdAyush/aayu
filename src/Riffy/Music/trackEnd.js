
const { Player, Track } = require("riffy")
const ExtendedClient = require('../../class/ExtendedClient');
const Track1 = require("../../handlers/xata").getXataClient().db.Track;
/**
 * 
 * @param {ExtendedClient} client
 * @param {Player} player
 * @param {Track} track
 */

module.exports = async (client, player, track) => {
    const Mdata = await Track1.filter({
        Guild: player.guildId,
        Track: player.previous.info.identifier,
    }).getFirst();
    
    if(Mdata) {
        const ch = await client.channels.fetch(Mdata.Channel);
        if(ch) {
            const msg = await ch.messages.fetch(Mdata.Message);
            if(msg) {
                await msg.delete();
            }
        }
        await Mdata.delete();
    }

}