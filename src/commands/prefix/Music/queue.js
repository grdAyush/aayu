const { ActionRowBuilder, ButtonBuilder, ButtonStyle,EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

const itemsPerPage = 10;

module.exports = {
    structure: {
        name: 'queue',
        description: 'see the queue',
        aliases: ["q"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message} message
     * @param {[String]} args
     */
    run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);
        if (message.guild.members.me.voice.channel.id !== message.member.voice.channel.id) return message.reply(`You are not in the same voice channel as me!`);
        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.reply(`I am Not Playing Right Now`);
        const queue = player.queue;
        if (!queue) return message.reply(`There is nothing in the queue`);

        const pages = Math.ceil(queue.length / itemsPerPage);
        let currentPage = 1;

        const generateEmbed = () => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentQueue = queue.slice(startIndex, endIndex);

            const embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setColor(client.color)
                .setTimestamp()
                .setDescription(currentQueue.map((track, i) => {
                    return `${startIndex + i + 1}. **${track.info.title}**`;
                }).join("\n"));

            embed.setFooter({text: `Page ${currentPage}/${pages}`});

            return embed;
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setEmoji("<:previous:1121646915726086225>")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setEmoji("<:next:1121646775770558494>")
                    .setStyle(ButtonStyle.Secondary),
            );

        const messageEmbed = await message.reply({
            embeds: [generateEmbed()],
            components: [row],
        });

        const filter = i => i.customId === 'previous' || i.customId === 'next';
        const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'previous' && currentPage > 1) {
                currentPage--;
            } else if (i.customId === 'next' && currentPage < pages) {
                currentPage++;
            }

            await i.update({
                embeds: [generateEmbed()],
                components: [row],
            });
        });

        collector.on('end', collected => {
            messageEmbed.edit({ components: [] });
        });
    }
};
