const ExtendedClient = require('../../class/ExtendedClient');
const { GatewayDispatchEvents} = require("discord.js")

module.exports = {
   event: 'raw',
    once: false,
    /**
     * @param {ExtendedClient} client
     * @param {*}  
     * @returns 
     */
    run: (client, d) => {
        if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate,].includes(d.t)) return;
        client.riffy.updateVoiceState(d);
    }
};
