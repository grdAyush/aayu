const Riffy = require("riffy")
const ExtendedClient = require('../class/ExtendedClient');
const fs = require("fs");
const Spotify = require("riffy-spotify")
const { Collection } = require("discord.js")
require("dotenv").config();
const nodes = [
    {
        name: process.env.NODE_NAME || "",
        host: process.env.NODE_HOST || "",
        port: process.env.NODE_PORT || 2000,
        password: process.env.NODE_PASS || "",
        secure: process.env.NODE_SECURR || false
    }
]
/**
 * @param {ExtendedClient} client 
 */
module.exports = async (client) => {
    const spotify = new Spotify.Spotify({
        clientId: process.env.SPOTIFY_CLIENT || "",
        clientSecret: process.env.SPOTIFY_SECRET || ""
    });
    client.riffy = new Riffy.Riffy(client, nodes, {
        send: (payload) => {
            const guild = client.guilds.cache.get(payload.d.guild_id);
            if (guild) guild.shard.send(payload);
        },
        defaultSearchPlatform: "ytmsearch",
        restVersion: "v4",
        plugins: [spotify]
    })
    client.on("ready", () => {
        client.riffy.init(client.user.id)
  
        })
    
    try {
        fs.readdirSync("./src/Riffy/Nodes").forEach(file => {
            const event = require(`../Riffy/Nodes/${file}`);
            let eventName = file.split(".")[0];
            client.riffy.on(eventName, event.bind(null, client));
        });
        fs.readdirSync("./src/Riffy/Music").forEach(file => {
            const event = require(`../Riffy/Music/${file}`);
            let eventName = file.split(".")[0];
            client.riffy.on(eventName, event.bind(null, client));
        });
    } catch (error) {
        console.log(error)
    }
}
