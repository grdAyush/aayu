const { Message } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
//const GuildSchema = require('../../../schemas/GuildSchema');
const { getXataClient } = require("../../../handlers/xata")
const xata = getXataClient()
module.exports = {
    structure: {
        name: 'prefix',
        description: 'Get/Set/Default prefix',
        aliases: [],
        permissions: "Administrator",
         category: "Utility",
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {


        const type = args[0];

        switch (type) {
            case 'set': {
           
                 let data = await xata.db.GuildSchema.read(`${message.guildId}`)
             

                

             

                const oldPrefix = data.prefix || config.handler.prefix;

                if (!args[1]) {
                    await message.reply({
                        content: 'You need to provide the prefix as a second parameter.'
                    });

                    return;
                }

              if (data)  { data.update({
                    prefix: args[1]
                })

              
            } else if (!data) {
                data = await xata.db.GuildSchema.create({
                  id: `${message.guildId}`,
                  prefix: `${args[1]}`,
                  TwentyFourSeven: false,
                  Autoplay: false,
                })
                  }
                

                await message.reply({
                    content: `The old prefix \`${oldPrefix}\` has been changed to \`${args[1]}\`.`
                });

                break;
            }

            case 'reset': {
                let data = await xata.db.GuildSchema.read(`${message.guildId}`)

                if (data) {
                   await data.update({
                        prefix: null
                    })
                }

                await message.reply({
                    content: `The new prefix on this server is: \`${config.handler.prefix}\` (default).`
                });

                break;
            }

            default: {
                await message.reply({
                    content: 'Allowed methods: `set`, `reset`'
                });

                break;
            }
        }
    }
};
