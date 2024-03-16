const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;
module.exports = {
    structure: {
        name: 'playlist-create',
        description: 'create a playlist ',
        aliases: ["plc", "create-playlist", "createpl", "pl-create", "plcreate", "createp"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        let PName = args.join(" ");
        if (!PName) return message.channel.send("Please provide a name for the playlist");
   
        const playlist = await Playlist.filter({
            name: PName
        })
        .getFirst();

        if (playlist) return message.channel.send("Playlist already exists");
        const Limit = await Playlist.filter({
            owner: message.author.id
        }).getAll();

        if(Limit.length >= 5) return message.channel.send("You can only have 5 playlists");

        await Playlist.create({
            name: PName,
            owner: message.author.id,
            tracks: [],
            created: Date.now(),
            Private: true
        });

        message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Playlist Created")
                .setDescription(`Successfully created playlist ${PName}`)
                .setColor(client.color)
                .setTimestamp()
            ]
        })
                                         
    }
};