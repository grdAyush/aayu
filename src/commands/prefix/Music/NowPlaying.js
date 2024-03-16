const { Message, PermissionFlagBits, EmbedBuilder , AttachmentBuilder} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const formatDuration = require("../../../../structures/FormatDuration.js");
const { musicCard } = require("musicard-bun");


module.exports = {
    structure: {
        name: 'nowplaying',
        description: 'show the current playing track',
       aliases: ["np", "now-playing"],
        permissions: null,
  cooldown: 7000,
        category: "Music",
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
        if(message.guild.members.me.voice.channel.id !== message.member.voice.channel.id) return message.reply(`You are not in the same voice channel as me!`);
        const player = client.riffy.players.get(message.guild.id);

        const song = player.current;
        const CurrentDuration = formatDuration(player.position);
        const TotalDuration = formatDuration(song.info.length);

        const Themes = [
            "space",
            "space+",
            "anime",
            "classic"
        ]
        const card = new musicCard()
        .setAuthor(song.info.author)
        .setName(song.info.title)
        .setBrightness(100)
        .setColor("auto")
        .setEndTime(TotalDuration)
        .setStartTime(CurrentDuration)
        .setProgress(player.position / song.info.length * 100)
        .setTheme(Themes[Math.floor(Math.random() * Themes.length)])
        .setThumbnail(song.info.thumbnail || client.user.displayAvatarURL())
        
 await card.build().then((buffer) => {
        const attachment = new AttachmentBuilder(buffer, { name: "music.png"});

        const Emoji = player.playing ? "🔴 |" : "⏸ |";
        if (!player) return message.reply(`I am Not Playing Right Now`);
        const embed = new EmbedBuilder()
        .setAuthor({ name: player.playing ? `Now playing...` : `Song paused`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
            .setColor(client.color)
            .addFields({ name: `Requester:`, value: `${song.info.requester}`, inline: true })
            .addFields({ name: `Volume:`, value: `${player.volume}%`, inline: true })
            .addFields({ name: `Queue Length:`, value: `${player.queue.length}`, inline: true })
            .setImage("attachment://music.png")
            .setTimestamp();


message.reply({ embeds: [embed], files: [attachment]})
      })                       
    }
};