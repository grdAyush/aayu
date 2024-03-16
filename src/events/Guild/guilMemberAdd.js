        const ExtendedClient = require('../../class/ExtendedClient');
        const { GuildMember } = require('discord.js');
        const Autoname = require("../../handlers/xata").getXataClient().db.Autoname;
        module.exports = {
           event: 'guildMemberAdd',
            once: false,
            /**
             * @param {ExtendedClient} client
             * @param {GuildMember} member 
             * @returns 
             */
            run: async (client, member) => {

              const data = await Autoname.read(`${member.guild.id}`);
               if(data && data.Toggle === true) {
                const name = data.Name.replace(/<user>/g, member.user.username);

                await member.setNickname(name);
               }
            }
        };