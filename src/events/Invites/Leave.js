const ExtendedClient = require('../../class/ExtendedClient');
const { GuildMember, Invite } = require('discord.js');
const Invites = require("../../handlers/xata").getXataClient().db.Invites;
const InviteBy = require("../../handlers/xata").getXataClient().db.InviteBy;
module.exports = {
   event: 'memberLeave',
    once: false,
    /**
     * @param {ExtendedClient} client
     * @param {GuildMember} member 
     * @param {Invite} invite
     * @param {GuildMember} inviter
     * @returns 
     */
    run: async (client, member, inviter, invite) => {

        const Data = await InviteBy.filter({
            Guild: member.guild.id,
            Member: member.id
        }).getFirst();
        if(Data) {
            const Data1 = await Invites.filter({
                Guild: member.guild.id,
                Inviter: Data.Inviter
            }).getFirst();
            if(Data1) {
                Data1.update({
                    Left: Data1.Left + 1
                })
                if(Data1.Invites > 0) {
                    await Data1.update({
                        Invites: Data1.Invites - 1 
                    })
                }
            }
        
           //console.log(`${member.user.username} Left the server!`);
        }
        
    }
};


