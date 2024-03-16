const {
    ChatInputCommandInteraction,
SlashCommandBuilder, EmbedBuilder
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const filter = "nightcore"

module.exports = {
   structure: new SlashCommandBuilder()
        .setName(`${filter}`)
        .setDescription(`set the filter to ${filter}`),
   options: {
        nsfw: false,
        developers: false
    },
   /**
     * @param {ExtendedClient} client
    * @param {ChatInputCommandInteraction} interaction
    */
    run: async (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);
        if (!player) return interaction.reply(`I am Not Playing Right Now`);
        const { channel } = interaction.member.voice;
        if (!channel) return interaction.reply(`You are not in a voice channel`);
        if(interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);


        interaction.reply({ components: [client.load]})

        player.filters.setNightcore(true)

        await interaction.editReply({
            content: `🎶 | **Filter has been set to:** \`${filter}\``,
    
        })
                       
    }
};