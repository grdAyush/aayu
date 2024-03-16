
const { Player, Track } = require("riffy")
const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Collection, Embed } = require("discord.js")
const formatduration = require("../../../structures/FormatDuration.js");
const Track1 = require("../../handlers/xata").getXataClient().db.Track;
const Player2 = require("../../handlers/xata").getXataClient().db.Player;
/**
 * 
 * @param {ExtendedClient} client
 * @param {Player} player
 * @param {Track} track
 */

module.exports = async (client, player, track) => {
    

    if(!player) return;
    
    const channel = client.channels.cache.get(player.textChannel);
    if(!channel) return;


  
const B = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
  .setCustomId("replay")
  .setEmoji(client.emoji.player.replay)
  .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
  .setCustomId("previous")
  .setEmoji(client.emoji.player.previous)
  .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
  .setCustomId("pause")
  .setEmoji(client.emoji.player.pause)
  .setStyle(ButtonStyle.Secondary),


  new ButtonBuilder()
  .setCustomId("next")
  .setEmoji(client.emoji.player.next)
  .setStyle(ButtonStyle.Secondary),


  new ButtonBuilder()
  .setCustomId("loop")
  .setEmoji(client.emoji.player.loop)
  .setStyle(ButtonStyle.Secondary),
)

const B0 = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
  .setCustomId("shuffle")
  .setEmoji(client.emoji.player.shuffle)
  .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
  .setCustomId("vol-")
  .setEmoji(client.emoji.player["volume-"])
  .setStyle(ButtonStyle.Secondary),


  new ButtonBuilder()
  .setCustomId("stop")
  .setEmoji(client.emoji.player.stop)
  .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
  .setCustomId("vol+")
  .setEmoji(client.emoji.player["volume+"])
  .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
  .setCustomId("queue")
  .setEmoji(client.emoji.music)
  .setStyle(ButtonStyle.Secondary),
)

    const source =  player.current.info.sourceName || "unknown";
    let src = "";
    if(source === "youtube") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974848888863/youtube.png"
    } else if (source === "spotify") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974404300902/spotify.png"
    } else if (source === "soundcloud") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974190383124/soundcloud.png"
    } else if (source === "twitch") {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070282974634975292/twitch.png"
    } else {
        src = "https://media.discordapp.net/attachments/1010784573061349496/1070283756100911184/question.png"
    }

    const gifs = [
      "https://wallpaperaccess.com/full/869905.gif",
      "https://i0.wp.com/i.pinimg.com/originals/34/16/fc/3416fc4113b69a0bf1cc75a772c4b5c4.gif",
      "https://media4.giphy.com/media/VbJeIn7jzpiTS9PczB/giphy.gif",
      "https://mir-s3-cdn-cf.behance.net/project_modules/fs/9fe826107812099.5faf8831d90b0.gif",
      "https://i.pinimg.com/originals/74/a2/89/74a289516ed995084972c2d50cadf047.gif",
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/12cbe8a4-f55c-4b40-85bb-d8e1405e7b84/d9nwsnt-d8dcabb0-6ce0-46aa-b34a-8e7e5c041296.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi8xMmNiZThhNC1mNTVjLTRiNDAtODViYi1kOGUxNDA1ZTdiODQvZDlud3NudC1kOGRjYWJiMC02Y2UwLTQ2YWEtYjM0YS04ZTdlNWMwNDEyOTYuZ2lmIn1dXX0.qotQCGEU_oa826P-CO_i0Tl8-_Nr5hEe0iR7mxotiDw",
      "https://i.pinimg.com/originals/51/7d/50/517d50010dfe6e71d17548cae0f6f0dc.gif",
      "https://i.4cdn.org/vp/1705711789124181.gif",
      "https://pa1.narvii.com/5579/60c21387fa69445cc17ef77b93aea220dfec671e_hq.gif",
      "https://gifdb.com/images/high/chill-night-glitch-pixel-art-jyasefmidungcb3c.gif"
    ]
    const embed = new EmbedBuilder()
        .setAuthor({ name: "Starting playing...", iconURL: "https://cdn.discordapp.com/emojis/1192911218399248436.gif" })
        .setDescription(`**[${track.info.title || "Unknow"}](https://s.aayubot.me/support)**`)
        .setColor(client.color)
        .addFields({ name: `Author:`, value: `${track.info.author || "Unknown"}`, inline: true })
        .addFields({ name: `Volume:`, value: `${player.volume}%`, inline: true })
        .addFields({ name: `Queue Length:`, value: `${player.queue.size}`, inline: true })
        .addFields({ name: `Duration:`, value: `${formatduration(track.info.length, true)}`, inline: true })
        .setImage(gifs[Math.floor(Math.random() * gifs.length)])
        .setFooter({ text: `Engine: ${UpCase(source)} | Requested By ${track.info.requester.displayName}`, iconURL: src })
        .setTimestamp()

        if (track.info.thumbnail) {
            embed.setThumbnail(track.info.thumbnail);
        } else {
            embed.setThumbnail(client.user.displayAvatarURL());
        }

const ch = await client.channels.cache
.get(player.textChannel)

const msg = await ch.send({ embeds: [embed], components: [B, B0]})
const Mdata = await Player2.read(player.guildId);

if(!Mdata) return;

 await Mdata.update({
  Message: msg.id,
})

await Track1.create({
  Guild: player.guildId,
  Channel: player.textChannel,
  Message: msg.id,
  Track: player.current.info.identifier,

})

const filter = (message) => {
    if(message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
    else {
      message.reply({ content: `Please Be In Same Voice Channel As Me`, ephemeral: true });
    }
  };

  const collecter = (await msg.createMessageComponentCollector({ filter}));

  collecter.on("collect", async (i) => {
    if(!player) return;
    if(i.customId === "replay") {
      if(!player) return;
      if(!player.current) return i.reply({ content: `No Track Playing`, ephemeral: true });
      player.seek(0);
      i.reply({ content: `Replaying`, ephemeral: true });
    } else if(i.customId === "previous") {
      if(!player) return;
      if(!player.previous) return   i.reply({ content: `There Is No Previous Track`, ephemeral: true });
      player.queue.unshift(player.previous);
      player.stop()
      i.reply({ content: `Playing Previous Track`, ephemeral: true });
    } else if(i.customId === "pause") {
      if(!player) return;
      if (player.paused) {
        player.pause(false);

       await B.components[2].setStyle(ButtonStyle.Secondary).setEmoji(client.emoji.player.pause);
        await msg.edit({ components: [B, B0] })
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("`⏯` Song Has Been Resumed")

        return i.reply({ embeds: [embed], ephemeral: true });
    } else {
      
      await B.components[2].setStyle(ButtonStyle.Success).setEmoji(client.emoji.player.resume);
      await msg.edit({ components: [B, B0] })
        player.pause(true);
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("`⏯` Song Has Been Paused")

        return  i.reply({ embeds: [embed], ephemeral: true });
    }
     
    } else if(i.customId === "next") {
      if(!player) return;
      player.stop();
      i.reply({ content: `Playing Next Track`, ephemeral: true });
    } else if(i.customId === "loop") {
      if(!player) return;
     if(player.loop === "queue") {
      player.setLoop("none")
      await B.components[4].setStyle(ButtonStyle.Secondary).setEmoji(client.emoji.player.loop);
      await msg.edit({ components: [B, B0] })
      i.reply({ content: `Loop Has Been Set To: None`, ephemeral: true });
     } else if(player.loop === "track") {
      player.setLoop("queue")
      await B.components[4].setStyle(ButtonStyle.Primary).setEmoji(client.emoji.player.loopq);
      await msg.edit({ components: [B, B0] })
      i.reply({ content: `Loop Has Been Set To: Queue`, ephemeral: true });
     } else {
      player.setLoop("track")
      await B.components[4].setStyle(ButtonStyle.Success).setEmoji(client.emoji.player.loopt);
      await msg.edit({ components: [B, B0] })
      i.reply({ content: `Loop Has Been Set To: Current`, ephemeral: true });
     }
    } else if(i.customId === "shuffle") {
      if(!player) return;
      if(!player.queue || !player.queue.length) return i.reply({ content: `No Track In Queue`, ephemeral: true });
      await player.queue.shuffle();
      i.reply({ content: `Shuffled The Queue`, ephemeral: true });
    } else if(i.customId === "vol-") {
      if(!player) return;
      const vol = Number(player.volume);
      if(vol <= 10) return i.reply({ content: `Volume Is Already At Lowest`, ephemeral: true });
      player.setVolume(vol - 10);
    await i.reply({ content: `Volume: ${player.volume}%`, ephemeral: true });
    } else if(i.customId === "stop") {
      if(!player) return;
        
      player.queue.clear();
      player.stop();
      player.destroy();

      i.message.delete();
      i.channel.send({ embeds: [ new EmbedBuilder().setDescription("Player Has Been stopped").setColor(client.color)
    .setFooter( { text:  `Requested By ${i.user.displayName}`})] });
    
    } else if(i.customId === "vol+") {
      const vol = Number(player.volume);
      if(!player) return;
      if(vol >= 150) return i.reply({ content: `Volume Is Already At Highest`, ephemeral: true });
      player.setVolume(vol + 10);
     await  i.reply({ content: `Volume: ${player.volume}%`, ephemeral: true });
    } else if(i.customId === "queue") {
      if(!player) return;
      if(!player.queue || !player.queue.length) return i.reply({ content: `No Track In Queue`, ephemeral: true });
      const queue = player.queue.slice(0, 7).map((track, i) => `${i + 1} - ${track.info.title} | ${track.info.author} | ${formatduration(track.info.length, true)}`).join("\n");
      const embed = new EmbedBuilder()
      .setAuthor({ name: "Queue", iconURL: "https://cdn.discordapp.com/emojis/1192911218399248436.gif" })
      .setDescription(queue)
      .setColor(client.color)
      .setTimestamp()
      .setFooter({ text: `Requested By ${player.current.info.requester.displayName}`, iconURL: player.current.info.requester.user.displayAvatarURL({ dynamic: true })})
      i.reply({ embeds: [embed], ephemeral: true });
    }
  })
  



}

function UpCase(char) {
  return char.charAt(0).toUpperCase() + char.slice(1);
}