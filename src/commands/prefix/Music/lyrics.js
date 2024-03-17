const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { Client } = require("genius-lyrics")
const genius = new Client(process.env.GENIUS_API)
                          
module.exports = {
    structure: {
        name: 'lyrics',
        description: 'get the lyrics of the current or other song',
       aliases: ["lyric"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        const msg = message.reply({
            components: [client.load]
        })

        const player = await client.riffy.players.get(message.guild.id);
       let song = "";
if(!player) {
    song = args.join(" ")
} else {
     song = player.current.info.title
}
        if (!song) return (await msg).edit({
            content: 'please provide a song to have the lyrics',
        })

        const search = await genius.songs.search(song)

        const lyrics = await search[0].lyrics()

        if(!lyrics) return (await msg).edit({
            content: 'No lyrics found.',
        })

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: search[0].artist.name, iconURL: search[0].image})
            .setTitle(search[0].title)
            .setDescription(lyrics)
            //.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))

(await msg).edit({ embeds: [embed] })
                                         
    }
};
