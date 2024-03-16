const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");
const music = require("../handlers/music");
module.exports = class extends Client {
    collection = {
        interactioncommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection()
        }
    };
    applicationcommandsArray = [];

    constructor() {
        super({
            allowedMentions: {
                repliedUser: false,
                parse: ["users"],
              },
            intents: 3276543,
            partials: [Object.keys(Partials)],
            presence: {
                activities: [{
                    name: 'Aayu 😘',
                    type: 4,
                    state: 'Your new Bot Bestie! 😉',
                }]
            }
        });
};

    start = async () => {
        const InviteManager = require('discord-invite');
 const invites = new InviteManager(this);
        commands(this);
        events(this);
        components(this);
        music(this);
       
     
        if (config.handler.mongodb.toggle) mongoose();
        this.emoji = require("../emojis.json");
        this.color = "#f158c6"
        await this.login(process.env.CLIENT_TOKEN || config.client.token);

        if (config.handler.deploy) deploy(this, config);
    };
};