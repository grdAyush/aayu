const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Data = require("../../../handlers/xata").getXataClient().db.NoPrefix;
module.exports = {
    structure: {
        name: 'no-prefix',
        description: 'add no prefix users',
       aliases: ["nopp"],
        permissions: null,
        cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

      const config = require('../../../config').users;
        if (!config.developers.includes(message.author.id)) return;
        const user = message.mentions.users.first() || client.users.cache.get(args[1]);
        const type = args[0];
        if (!user) return;
        if (!type) return;
        if(type !== "add" && type !== "remove") return;
           const data = await Data.read(`Aayu`);      
        if(type === "add") {
            if(data.Users.includes(user.id)) return message.channel.send("Already in the list")
            await data.update({
        Users: [...data.Users, user.id]
        })
            message.channel.send(`Added ${user.tag} To No Prefix Users`);
        } else if(type === "remove") {
            if(!data.Users.includes(user.id)) return message.channel.send("Not in the list")
            await data.update({
        Users: data.Users.filter((x) => x !== user.id)
        })
            message.channel.send(`Removed ${user.tag} From No Prefix Users`);
        }                       
    }
};