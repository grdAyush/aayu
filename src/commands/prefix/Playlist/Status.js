        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;   
module.exports = {
    structure: {
        name: 'playlist-status',
        description: 'change the status of the playlist (Private or Public)',
        aliases: ["pl-status", "playlist-status", "pllist-status", "pllists-status", "playlist-list-status", "playlist-lists-status"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        if(!args) return message.reply("Please Provide the name of the Playlist")

        const Pname = args.join(" ");

        const playlist = await Playlist.filter({
            name: Pname,
            owner: message.author.id
        }).getFirst();

        if(!playlist) return message.reply({ content: "I Think That Playlist not exist or not belongs to you"})

        const status = playlist.Private;

        if(status) {
            await playlist.update({
                Private: false
            })

            message.reply({ content: "Successfully Made Your Playlist Public"})
        }
         else {
            await playlist.update({
                Private: true
            })

            message.reply({
                content: " Successfully Privatised The Playlist"
            })
         }
    }
};