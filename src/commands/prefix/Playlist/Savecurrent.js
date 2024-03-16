        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;
module.exports = {
    structure: {
        name: 'savecurrent',
        description: 'save current playing song to the playlist',
       aliases: ["sc", "save-current", "save-current-song", "save-current-song-to-playlist", "save-current-song-to-playlists", "save-current-song-to-playlists"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        if(!args) return message.reply({
            content: "Please Provide The Playlist name in which you want to save the song"
        })
        const player = client.riffy.players.get(message.guildId)
        if(!player) return message.reply({
            content: "I am not playing anything"
        })
        const current = player.current;

        if(!current) return message.reply({
            content: "I am not playing anything"
        })


        const playlist = await Playlist.filter({
            owner: message.author.id,
            name: args.join(" ")
        }).getFirst();

        if(!playlist) return message.reply({
            content: "No Playlist Found with that name"
        })

        const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(client.color)
        .setTimestamp()
        .setDescription(`**[${current.info.title}](${current.info.uri})** Has Been Added To **${playlist.name}** Playlist`)
                                         
        await playlist.update({
            tracks: [...playlist.tracks, `${current.info.title} By ${current.info.author} `]
        })

        message.reply({
            embeds: [embed]
        })
    }
};