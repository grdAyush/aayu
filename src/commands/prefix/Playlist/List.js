        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;
module.exports = {
    structure: {
        name: 'playlists',
        description: 'view your playlists',
       aliases: ["pl", "playlist", "pllist", "pl-lists", "playlist-list", "playlist-lists"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        const lmsg = message.reply({
            components: [
                client.load
            ]
        })
                                         
        const playlist = await Playlist.filter({
            owner: message.author.id
        }).getAll();
        if(!playlist.length) return (await lmsg).edit({content: "You dont have any playlists", components: []});
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL()})
        .setDescription(playlist.map((pl, i) => `\`${i + 1}\` - ${pl.name}`).join("\n"));
      (await lmsg).edit({embeds: [embed], components: []});
    }
};