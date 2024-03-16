        const ExtendedClient = require('../../class/ExtendedClient');
        const { EmbedBuilder, WebhookClient, Guild} = require('discord.js');
        const moment = require("moment");
        module.exports = {
           event: 'guildDelete',
            once: false,
            /**
             * @param {ExtendedClient} client
             * @param {Guild} guild 
             * @returns 
             */
            run: async (client, guild) => {

                const own = await client.users.fetch(guild.ownerId);
                const channel = new WebhookClient({
                    url: "https://discord.com/api/webhooks/1154085795565678766/yMWojmoThvyQw7NEqRK2I8XfZjVh7r_4oZL6srTTb3Ib3l1QRBYbtbdRUJa0cesus0rA"
                })
                const embed = new EmbedBuilder()
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                .setTitle(`📤 Left a Guild !!`)
                .addFields([
                  { name: 'Name', value: `\`${guild.name}\`` },
                  { name: 'ID', value: `\`${guild.id}\`` },
                  { name: 'Owner', value: `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"} [ ${own.id} ]\`` },
                  { name: 'Member Count', value: `\`${guild.memberCount}\` Members` },
                  { name: 'Creation Date', value: `\`${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\`` },
                  { name: `${client.user.username}'s Server Count`, value: `\`${client.guilds.cache.size}\` Severs` }
                ])
                .setColor(client.color)
                .setTimestamp()
              channel.send({ embeds: [embed] });
                             
            }
        };