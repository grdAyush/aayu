const { readdirSync } = require('fs');
const { log } = require('../functions');
const ExtendedClient = require('../class/ExtendedClient');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = (client) => {

   
    client.load = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('load')
        .setEmoji(`<a:loading2:1184093267499954248>`)
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
    )

    client.disabled = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji("<:stop:1121647467503562842>")
        .setDisabled(true)
        .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
        .setCustomId("pause")
        .setEmoji("<:pause1:1121092897534648340>")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary),
        
        new ButtonBuilder()
        .setCustomId("skip")
        .setDisabled(true)
        .setEmoji("<:next:1121646775770558494>")
        .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
        .setCustomId("loop")
        .setDisabled(true)
        .setEmoji("<:loop1:1121647173059231744>")
        .setStyle(ButtonStyle.Primary)
    )
    for (const type of readdirSync('./src/commands/')) {
        for (const dir of readdirSync('./src/commands/' + type)) {
            for (const file of readdirSync('./src/commands/' + type + '/' + dir).filter((f) => f.endsWith('.js'))) {
                const module = require('../commands/' + type + '/' + dir + '/' + file);

                if (!module) continue;

                if (type === 'prefix') {
                    if (!module.structure?.name || !module.run) {
                        log('Unable to load the command ' + file +' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');
        
                        continue;
                    };

                    client.collection.prefixcommands.set(module.structure.name, module);

                    if (module.structure.aliases && Array.isArray(module.structure.aliases)) {
                        module.structure.aliases.forEach((alias) => {
                            client.collection.aliases.set(alias, module.structure.name);
                        });
                    };
                } else {
                    if (!module.structure?.name || !module.run) {
                        log('Unable to load the command ' + file +' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');
        
                        continue;
                    };

                    client.collection.interactioncommands.set(module.structure.name, module);
                    client.applicationcommandsArray.push(module.structure);
                };

                log('Loaded new command: ' + file, 'info');
            };
        };
    };
};