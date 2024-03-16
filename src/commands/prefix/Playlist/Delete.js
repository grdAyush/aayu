        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;
module.exports = {
    structure: {
        name: 'playlist-delete',
        description: 'delete a playlist',
       aliases: [],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        if(!args) return message.reply("Please provide a playlist name")

        const playlist = await Playlist.filter({
            name: args.join(" "),
            owner: message.author.id
        }).getFirst();

        if(!playlist) return message.reply("Could not find that playlist");

        await playlist.delete();

        message.reply("Deleted playlist")

                                         
    }
};