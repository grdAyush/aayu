        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Autoname = require("../../../handlers/xata").getXataClient().db.Autoname;
module.exports = {
    structure: {
        name: 'autoname',
        description: 'setup autoname',
       aliases: [],
        permissions: ["ManageGuild"]
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
                   const type = args[0];
                  
        switch (type) {

            case "set": {
                if(!args[1]) return message.reply("You need to provide a name");
                const name = args[1];

                if(name.length > 30 ) return message.reply("Name must be less than 30 characters");

                const data = await Autoname.read(`${message.guildId}`);
                if(data) {
                    data.update({
                        Name: name,
                        Toggle: true
                    });
                } else {
                    await Autoname.create({
                        id: message.guildId,
                        Name: name,
                        Toggle: true
                    });
                }

                message.reply({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Autoname")
                    .setDescription(`Autoname Has been setuped Now Anyone Join The Server Will Be Named ${name.replace(/<user>/g, message.author.username)}`)
                    .setColor(client.color)
                ]})

                break;
            }
            case "disable": {
                const data = await Autoname.read(`${message.guildId}`);
                if(!data) return message.reply("Autoname is not setuped");
                data.update({
                    Toggle: false
                });
                message.reply({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Autoname")
                    .setDescription(`Autoname Has been disabled`)
                    .setColor(client.color)
                ]})
                break;
            }

            case "info": {
                const data = await Autoname.read(`${message.guildId}`);

                message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Autoname")
                        .setDescription(`Name: ${data.Name || "Not Setuped"}\nToggle: ${data.Toggle ? "Enabled" : "Disabled"}\n\nInfo: Anyone Join The Server There Nickname set to the name that you will setup\n\n Tags: Use <user> to replace the name with the user name\n\nExample: <user> is cool\n\nOutput: ${message.author.username} is cool`)
                        .setColor(client.color)
                    ]
                })

                break;
            }

            default: {
                message.reply("Allowed Types: `set`, `disable`, `info`")

                break;
            }
        }                      
    }
};