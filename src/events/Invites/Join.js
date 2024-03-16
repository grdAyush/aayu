        const ExtendedClient = require('../../class/ExtendedClient');
        const { GuildMember, Invite } = require('discord.js');
        const Invites = require("../../handlers/xata").getXataClient().db.Invites;
        const InviteBy = require("../../handlers/xata").getXataClient().db.InviteBy;
        module.exports = {
           event: 'memberJoin',
            once: false,
            /**
             * @param {ExtendedClient} client
             * @param {GuildMember} member 
             * @param {Invite} invite
             * @param {GuildMember} inviter
             * @returns 
             */
            run: async (client, member, inviter, invite) => {

              if(member.user.bot) return;
              if(inviter.user.bot) return;

            

                if(!inviter) {
                  return;
                    
                  } else if(member.id == inviter.id) {
                    return;
               
                  }else if(member.guild.vanityURLCode == inviter.id) {
                   
                    return;
                  } else {
                    let  Data = await Invites.filter({
                        Guild: member.guild.id,
                        Inviter: inviter.id
                    }).getFirst();
                    let Data1 = await InviteBy.filter({
                        Guild: member.guild.id,
                        Member: member.id,
                        Inviter: inviter.id
                    }).getFirst();

                    const Fake = !isSevenDaysOld(member.user.createdAt) ;
                    if(!Data) {
                        Data = await Invites.create({
                            Guild: member.guild.id,
                            Inviter: inviter.id,
                            Invites: 0,
                            Left: 0,
                            Rejoin: 0,
                            Fake: 0,
                            Joins: 0
                        })
                    }
                     if(Data1) {
                          Data.update({
                          Rejoin: Data.Rejoin + 1,
                          Joins: Data.Joins + 1
                         })
                         
                   
                    }
                   else if(Fake) {
                    
                    await InviteBy.create({
                        Guild: member.guild.id,
                        Member: member.id,
                        Inviter: inviter.id
                    })
                    
                   await Data.update({
                        Fake: Data.Fake + 1 ,
                        Invites: Data.Joins + 1 || 1
                   })
                    } else {
                       
                        await Data.update({
                            Invites: Data.Invites + 1 || 1,
                            Joins: Data.Joins + 1 || 1
                          })
                          await InviteBy.create({
                            Guild: member.guild.id,
                            Member: member.id,
                            Inviter: inviter.id
                        })
                       
                    
                    }
                  };
                             
            }
        };


        function isSevenDaysOld(createdAt) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return createdAt < sevenDaysAgo;
          }