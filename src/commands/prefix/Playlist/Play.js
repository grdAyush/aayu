        const { Message, PermissionFlagBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;
module.exports = {
    structure: {
        name: 'playlist-play',
        description: 'play your or other public playlist',
       aliases: ["pl-play", "playlist-play", "pllist-play", "pllists-play", "playlist-list-play", "playlist-lists-play"],
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
            content: "Please Provide The Playlist name for playing the song"
        })

        const lmsg = message.reply({
            components:  [client.load]
        })

        let playlist = await Playlist.filter({
            name: args.join(" "),
            owner: message.author.id
        }).getFirst()

        if(!playlist) {
    playlist = await Playlist.filter({
        name: args.join(" "),
        Private: false
    }).getFirst()
      }


      if(!playlist) return (await lmsg).edit({ content: "Could not Find That Playlist"})
      

      const { channel } = message.member.voice;
      if (!channel) return (await lmsg).edit( { content: `You are not in a voice channel`, components: []});
      if (!channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.Connect)) return message.channel.send(`I don't have permission to join your voice channel!`);
      if (!channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.Speak)) return message.channel.send(`I don't have permission to speak in your voice channel!`);
  
      let player = client.riffy.players.get(message.guildId)
    if(!player){
       player = await client.riffy.createConnection({
          guildId: message.guild.id,
          voiceChannel: channel.id,
          textChannel: message.channel.id,
          deaf: true,
      });}


      for( i of playlist.tracks) {
        const res =  await client.riffy.resolve({ query: i, requester: message.member })

        const { loadType, tracks, playlistInfo } = res;

       if (loadType === 'search' || loadType === 'track') {
            const trackToAdd = tracks.shift();
            trackToAdd.info.requester = message.member;

            
            if (!player.queue.includes(trackToAdd)) {
                player.queue.add(trackToAdd);
                if (!player.playing && !player.paused) player.play();
            }
        } else {
           // message.channel.send({ content: `Error Playing ${track}` });
        }
      }


      (await lmsg).edit({ components: [], embeds: [
        new EmbedBuilder()
        .setDescription(`Queued **${playlist.name}**`)
        .setColor(client.color)
      ]});                               
    }
};