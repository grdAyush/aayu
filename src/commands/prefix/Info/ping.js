const { Message, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'ping',
        description: 'Replies with Pong!',
        aliases: [],
        permissions: 'Administrator',
        cooldown: 5000,
        category: "Utility",
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const msg = await message.channel.send('Pinging...');

        const latency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = client.ws.ping;

        await msg.edit({ content: " ", embeds: [ new EmbedBuilder().setDescription(`\`\`\`asciidoc
Latency     :: ${latency}ms
API Latency :: ${apiLatency}ms\`\`\``).setColor(client.color)] });


    }
};
