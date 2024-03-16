const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, ButtonStyle } = require('discord.js'); 
const { ExtendedClient } = require('../../../class/ExtendedClient');
const Invites = require("../../../handlers/xata").getXataClient().db.Invites;

module.exports = {
    structure: {
        name: 'invite-leaderboard',
        description: 'Shows the leaderboard of the invites',
        aliases: ["invites-leaderboard", "invites-lb", "invite-lb", "ilb", "i-lb", "i-leaderboard", "invites-leaderboard"],
        permissions: null,
        cooldown: 7000,
        category: "Invites",
    },

    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        const invitesData = await Invites.filter({ Guild: message.guildId }).sort("Invites", "desc").getAll();

        if (!invitesData.length) return message.reply('No invites found');

        const pageSize = 7; 
        const pages = Math.ceil(invitesData.length / pageSize);

        let currentPage = 1;

        const generateEmbed = (page) => {
          const embed = new EmbedBuilder()
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
              .setTitle('Invite Leaderboard')
              .setDescription(invitesData.slice((page - 1) * pageSize, page * pageSize).map((data, index) => {
                  let rankEmoji;
                  if (index + 1 === 1) {
                      rankEmoji = '<a:first:1198163068207779912>'; 
                  } else if (index + 1 === 2) {
                      rankEmoji = '<a:second:1198163245618442251>'; 
                  } else if (index + 1 === 3) {
                      rankEmoji = '<a:third:1198163088499810334>';
                  } else {
                      rankEmoji = ` \`#${index + 1}\``;
                  }
                  return `${rankEmoji} ${message.guild.members.cache.get(data.Inviter)?.user || 'Unknown User'} • **${data.Invites}** Invites (**${data.joins}** Joins | **${data.Rejoin}** Rejoins | **${data.Left}** Left | **${data.Fake}** Fake)`;
              }).join('\n'))
              .setColor(client.color)
              .setFooter({ text: `Page ${page} of ${pages}` });
      
          return embed;
      };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setEmoji("<:previous:1121646915726086225>")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === 1),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setEmoji("<:next:1121646775770558494>")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === pages),
            );

        const messageOptions = {
            embeds: [generateEmbed(currentPage)],
            components: [row],
        };

        const msg = await message.reply(messageOptions);

        const filter = (interaction) => {
            interaction.deferUpdate();
            return interaction.user.id === message.author.id;
        };

        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (interaction.customId === 'next' && currentPage < pages) {
                currentPage++;
            }

            row.components[0].setDisabled(currentPage === 1);
            row.components[1].setDisabled(currentPage === pages);

            await interaction.reply({
                embeds: [generateEmbed(currentPage)],
                components: [row],
            });
        });

        collector.on('end', () => {
            msg.edit({
                components: [],
            });
        });
    }
};
