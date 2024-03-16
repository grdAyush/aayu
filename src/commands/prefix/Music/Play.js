const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');


module.exports = {
    structure: {
        name: 'play',
        description: 'play music in the voice channel',
       aliases: ["baja", "p"],
        permissions: null,
  cooldown: 7000,
        category: "Music",
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     *
     */
    run: async (client, message, args) => {
                const search = args.join(" ");

                const { channel } = message.member.voice;
                if (!channel) return message.reply(`You are not in a voice channel`);
                if (!channel.joinable) return message.reply(`I can't join your voice channel!`);
                if (!channel.speakable) return message.reply(`I can't speak in your voice channel!`);
                if (channel.userLimit && channel.members.size >= channel.userLimit) return message.reply(`Your voice channel is full!`);
                if (!channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.Connect)) return message.reply(`I don't have permission to join your voice channel!`);
                if(message.guild.members.me.voice.channelId && message.guild.members.me.voice.channelId !== channel.id) return message.reply(`I am already in a voice channel!`);
                if (!channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.Speak)) return message.reply(`I don't have permission to speak in your voice channel!`);

                if (!search) return message.reply({ content: `Please provide a search query!` });

             const msg = await message.reply({content: `🔍 **Searching...** \`${search}\``});
            
                const player = await client.riffy.createConnection({
                    guildId: message.guild.id,
                    voiceChannel: channel.id,
                    textChannel: message.channel.id,
                    deaf: true,
                })


                const res =  await client.riffy.resolve({ query: search, requester: message.member })

                const { loadType, tracks, playlistInfo } = res;

                if (loadType === 'playlist') {
                    for (const track of tracks) {
                        track.info.requester = message.member;
                        player.queue.add(track);
                    }

                    if (!player.playing && !player.paused) player.play();
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Queued • ${playlistInfo.name}**`)
        
                    return msg.edit({ content: " ", embeds: [embed] })
                } else if (loadType === 'search' || loadType === 'track') {
             const track = tracks.shift();
            track.info.requester = message.member;

            player.queue.add(track);

            if (!player.playing && !player.paused) player.play();
            const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Queued**: \`${track.info.title}\``)
                

                msg.edit({ content: " ",  embeds: [embed]})

                                   
                } else {
                    return msg.edit(`No results found for \`${search}\``);
                }
             
    }
};