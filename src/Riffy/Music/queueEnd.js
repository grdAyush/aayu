const GuildSchema = require("../../handlers/xata").getXataClient().db.GuildSchema;
const { Player } = require("riffy")
const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder, ChannelFlagsBitField } = require("discord.js")
const Track = require("../../handlers/xata").getXataClient().db.Track;
/**
 * 
 * @param {ExtendedClient} client 
 * @param {Player} player 
 */
module.exports = async (client, player) => {
    
const Mdata = await Track.filter({
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

    let Data = await GuildSchema.read(player.guildId);
    
    if(!Data) {
        Data = GuildSchema.create({
            id: player.guildId,
        })
    }
    if(Data.Autoplay){
        return player.autoplay(player)
    } else if (!Data.Autoplay && !Data.TwentyFourSeven) {
        player.destroy();
        const embed = new EmbedBuilder()
        .setDescription("Queue Has Been Ended Add More Songs To Continue Playing")
        .setColor(client.color)
        .setTimestamp()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
    
        const channel = client.channels.cache.get(player.textChannel);
        if(!channel) return;
        channel.send({ embeds: [embed] })
    
        
    } else if (Data.TwentyFourSeven) {
        const embed = new EmbedBuilder()
        .setDescription("Queue Has Been Ended Add More Songs To Continue Playing")
        .setColor(client.color)
        .setTimestamp()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
    
        const channel = client.channels.cache.get(player.textChannel);
        if(!channel) return;
        channel.send({ embeds: [embed] })
    }


}