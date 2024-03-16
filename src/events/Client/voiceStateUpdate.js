const ExtendedClient = require("../../class/ExtendedClient");
const Guild = require("../../handlers/xata").getXataClient().db.GuildSchema;
const {
  VoiceState,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");
module.exports = {
  event: "voiceStateUpdate",
  once: false,
  /**
   * @param {ExtendedClient} client
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @returns
   */
  run: async (client, oldState, newState) => {
    const player = client.riffy.players.get(newState.guild.id);
    if (!player) return;

    if (!newState.guild.members.cache.get(client.user.id).voice.channelId)
      player.destroy();

    if (
      newState.channelId &&
      newState.channel.type == "GUILD_STAGE_VOICE" &&
      newState.guild.members.me.voice.suppress
    ) {
      if (
        newState.guild.members.me.permissions.has(
          PermissionsBitField.Flags.Connect
        ) ||
        (newState.channel &&
          newState.channel
            .permissionsFor(nS.guild.members.me)
            .has(PermissionsBitField.Flags.Speak))
      ) {
        newState.guild.members.me.voice.setSuppressed(false);
      }
    }

    if (oldState.id === client.user.id) return;
    if (!oldState.guild.members.cache.get(client.user.id).voice.channelId)
      return;
    const data = await Guild.read(newState.guild.id)
    if(data && data.TwentyFourSeven) return;

    const vcRoom = oldState.guild.members.me.voice.channel.id;
    const leaveEmbed = client.channels.cache.get(player.textChannel);

    if (
      oldState.guild.members.cache.get(client.user.id).voice.channelId ===
      oldState.channelId
    ) {
      if (
        oldState.guild.members.me.voice?.channel &&
        oldState.guild.members.me.voice.channel.members.filter(
          (m) => !m.user.bot
        ).size === 0
      ) {
        await delay(60000);

        const vcMembers = oldState.guild.members.me.voice.channel?.members.size;

        if (!vcMembers || vcMembers === 1) {
          const newPlayer = client.riffy.players.get(newState.guild.id);

          newPlayer
            ? await player.destroy()
            : oldState.guild.members.me.voice.channel.leave();

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Support")
              .setURL("https://s.aayubot.me/support")
              .setStyle(ButtonStyle.Link)
          );

          const TimeoutEmbed = new EmbedBuilder()
            .setDescription(
              `Leaving The Voice Channel Since No One is Listening to Music. If you want me to stay in the voice channel, type \`/24/7\` to enable 24/7 mode.`
            )
            .setColor(client.color);

          try {
            if (leaveEmbed)
              leaveEmbed.send({ embeds: [TimeoutEmbed], components: [row] });
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
