const { Message, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    structure: {
        name: 'eval',
        description: 'Executes JavaScript code.',
        aliases: ["evaluate", "execute"],
        permissions: null,
        cooldown: 2000
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message} message
     * @param {[String]} args
     */
    run: async (client, message, args) => {
        const ownerId = process.env.OWNER_ID;
        // Making sure that only the bot owner can use this command
        if (message.author.id !== ownerId) {
            const permissionEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error!')
                .setDescription('You do not have permission to use this command.')
                .setTimestamp();
            return message.reply({ embeds: [permissionEmbed] });
        }

        // Checking for dangerous commands
        const code = args.join(" ");
        if (/client\.token|env\.token|token/gi.test(code)) {
            const warningEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Warning!')
                .setDescription('Access to sensitive properties is prohibited.')
                .setTimestamp();
            return message.reply({ embeds: [warningEmbed] });
        }

        try {
            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth: 0 });

            // Creating embed for the result
            const resultEmbed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('Eval Result')
                .addFields({ name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` })
                .setTimestamp();

            // Splitting the message to avoid Discord's 2000 character limit, for the output
            if (evaled.length > 1024) {
                const firstPart = evaled.substring(0, 1020) + "...";
                resultEmbed.addFields({ name: '📤 Output', value: `\`\`\`js\n${firstPart}\`\`\`` });
            } else {
                resultEmbed.addFields({ name: '📤 Output', value: `\`\`\`js\n${evaled}\`\`\`` });
            }

            message.reply({ embeds: [resultEmbed] });
        } catch (err) {
            // Creating embed for the error
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Eval Error')
                .addFields({ name: 'Error', value: `\`\`\`js\n${err.message}\`\`\`` })
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    },
};