const { Message, PermissionFlagBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const formatDuration = require("../../../../structures/FormatDuration")
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'seek',
        description: 'seek the music to a certain time',
       aliases: [],
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

    if(!args[0] || isNaN(args[0])) {
        return message.channel.send("Please provide a valid number")
    }
const { channel } = message.member.voice;
    const player = client.riffy.players.get(message.guild.id);
    if(!player) return message.reply(`I am not in a voice channel`);
    if(!channel) return message.reply(`You are not in a voice channel`);
    if(message.guild.members.me.voice.channel.id !== message.member.voice.channel.id) return message.reply(`You are not in the same voice channel as me!`);

if(!args[0]) return message.reply("Please Provide The Duration")
    if(args[0]*1000 >= player.current.info.length || args[0]*1000 <= 0) 
        return message.reply(`Please provide a valid number`);


    player.seek(args[0]*1000);
    const song = player.current.info;
    const CurrentDuration = formatDuration(player.position);
    const TotalDuration = formatDuration(song.length);
    const Part = Math.floor(player.position / song.length * 30);
    const Emoji = player.playing ? "🔴 |" : "⏸ |";


    const Duration = formatDuration(player.position);
    const embed = new EmbedBuilder()
        .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
        .addFields({ name: `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'-'.repeat(Part) + '🎶' + '-'.repeat(30 - Part)}\`\`\``, inline: false })
        .setColor(client.color);


        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("-10")
            .setLabel("- 10")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("+10")
            .setLabel("+10")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("+30")
            .setLabel("+ 30")
            .setStyle(ButtonStyle.Secondary),

   

            new ButtonBuilder()
            .setCustomId("-30")
            .setLabel("- 30")
            .setStyle(ButtonStyle.Secondary),
        )



    const msg = message.reply({ embeds: [embed], components: [Buttons] });

    const filter = i => i.user.id === message.author.id;
    const collector = (await msg).createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async i => {
        if (i.customId === "+10") {
            const song = player.current.info;
            const CurrentDuration = formatDuration(player.position);
            const TotalDuration = formatDuration(song.length);
            const Part = Math.floor(player.position / song.length * 30);
            const Emoji = player.playing ? "🔴 |" : "⏸ |";

            if (player.position + 10000 >= player.current.info.length) return i.reply({ content: "You can't seek more than the song duration", ephemeral: true });
           await player.seek(player.position + 10000);
            const Duration = formatDuration(player.position);
            const embed = new EmbedBuilder()
                .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
                .addFields({ name: `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'-'.repeat(Part) + '🎶' + '-'.repeat(30 - Part)}\`\`\``, inline: false })
                .setColor(client.color);

          await  i.update({ embeds: [embed], components: [Buttons] });

        } else if (i.customId === "+30") {
            const song = player.current.info;
            const CurrentDuration = formatDuration(player.position);
            const TotalDuration = formatDuration(song.length);
            const Part = Math.floor(player.position / song.length * 30);
            const Emoji = player.playing ? "🔴 |" : "⏸ |";

            if (player.position + 30000 >= player.current.info.length) return i.reply({ content: "You can't seek more than the song duration", ephemeral: true });
            await player.seek(player.position + 30000);
            const Duration = formatDuration(player.position);
            const embed = new EmbedBuilder()
                .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
                .addFields({ name: `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'-'.repeat(Part) + '🎶' + '-'.repeat(30 - Part)}\`\`\``, inline: false })
                .setColor(client.color);

          await  i.update({ embeds: [embed], components: [Buttons] });

        } 

        else if (i.customId === "-10") {
            const song = player.current.info;
            const CurrentDuration = formatDuration(player.position);
            const TotalDuration = formatDuration(song.length);
            const Part = Math.floor(player.position / song.length * 30);
            const Emoji = player.playing ? "🔴 |" : "⏸ |";

            if (player.position - 10000 <= 0) return i.reply({ content: "You can't seek less than 0", ephemeral: true });
            await player.seek(player.position - 10000);
            const Duration = formatDuration(player.position);
            const embed = new EmbedBuilder()
                .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
                .addFields({ name: `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'-'.repeat(Part) + '🎶' + '-'.repeat(30 - Part)}\`\`\``, inline: false })
                .setColor(client.color);

         await   i.update({ embeds: [embed], components: [Buttons] });

        } else if (i.customId === "-30") {
            const song = player.current.info;
            const CurrentDuration = formatDuration(player.position);
            const TotalDuration = formatDuration(song.length);
            const Part = Math.floor(player.position / song.length * 30);
            const Emoji = player.playing ? "🔴 |" : "⏸ |";

            if (player.position - 30000 <= 0) return i.reply({ content: "You can't seek less than 0", ephemeral: true });
            await player.seek(player.position - 30000);
            const Duration = formatDuration(player.position);
            const embed = new EmbedBuilder()
                .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
                .addFields({ name: `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'-'.repeat(Part) + '🎶' + '-'.repeat(30 - Part)}\`\`\``, inline: false })
                .setColor(client.color);

           await i.update({ embeds: [embed], components: [Buttons] });

        }})


                                         
    }
};
