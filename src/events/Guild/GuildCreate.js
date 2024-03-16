const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder, Guild, WebhookClient, ChannelType } = require('discord.js');
const moment = require('moment');
module.exports = {
    event: 'guildCreate',
    once: false,
    /**
     * @param {ExtendedClient} client
     * @param {Guild} guild 
     * @returns 
     */
    run: async (client, guild) => {

        const own = await client.users.fetch(guild.ownerId);
        const channel = new WebhookClient({
            url: "https://discord.com/api/webhooks/1154086558668947576/yeFjEFCH9HmySrekhL7tqlLWAlkRD7Cm6zpdxO-jZLEf0uxi8UIDGMgIz_ATal_pJq1l"
        })
        const invite = await guild.invites.create(guild.channels.cache.filter(c => c.type === ChannelType.GuildText).first().id, { maxAge: 0, maxUses: 0, unique: true, reason: 'Invite for the bot' })
        const embed = new EmbedBuilder()
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
        .setTitle(` Joined a Guild !!`)
        .addFields(
          { name: 'Name', value: `\`${guild.name}\`` },
          { name: 'ID', value: `\`${guild.id}\`` },
          { name: 'Owner', value: `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"} [ ${own.id} ] \`` },
          { name: 'Member Count', value: `\`${guild.memberCount}\` Members` },
          { name: 'Creation Date', value: `\`${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\`` },
          { name: 'Guild Invite', value: `[Here is ${guild.name} invite ](https://discord.gg/${invite.code})` },
          { name: `${client.user.username}'s Server Count`, value: `\`${client.guilds.cache.size}\` Severs` }
        )
        .setColor(client.color)
        .setTimestamp()
      channel.send({ embeds: [embed] });

    }
};