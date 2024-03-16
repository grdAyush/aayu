const ExtendedClient = require("../../class/ExtendedClient");
const { Message, EmbedBuilder, ChannelType } = require("discord.js");
const Level = require("../../handlers/xata").getXataClient().db.Level;
const User = require("../../handlers/xata").getXataClient().db.UserXP;

module.exports = {
  event: "messageCreate",
  once: false,
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    const Data = await Level.read(`${message.guild.id}`);
    if (!Data || Data.Toggle === false || !Data.Toggle) return;

    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    if (Data.IgnoreXP && Data.IgnoreXP.includes(message.channel.id)) return;

    let UserData = await User.filter({
      Guild: message.guild.id,
      User: message.author.id,
    }).getFirst();

    if (!UserData) {
      UserData = await User.create({
        Guild: message.guild.id,
        User: message.author.id,
        XP: 0,
        Level: 0,
      });
    }

    const ExtraXP = [20, 5, 7, 9, 30, 15, 22, 2];
    if (
      UserData.LastXp &&
      UserData.LastXp + (Data.XPTimeout || 5000) > Date.now()
    )
      return;
    let xp = Math.floor(
        (Math.random() * (Data.Uplimit - Data.LowLimit) + Data.LowLimit) *
          Data.XPRate
      ),
      reqXP = 100;

    if (Data.ExtraXP && Data.ExtraXP.includes(message.channelId)) {
      xp += ExtraXP[Math.floor(Math.random() * ExtraXP.length)];
    }

    for (let i = 1; i <= UserData.Level; i++)
      reqXP += 5 * (i ^ 2) + 50 * i + 100;

    const newXP = UserData.XP + xp;
    if (newXP >= reqXP) {
      const newLevel = UserData.Level += 1;


Data.LevelRewards = Data.LevelRewards || {};
  const   r = Data.LevelRewards[newLevel] ? Data.LevelRewards[newLevel] : undefined;
      const role = message.guild.roles.cache.get(r),
      channel =
        message.guild.channels.cache.get(Data.AnnounceChannel) ||
        message.channel;
      
  
      const replacements = {
        "{user}": message.author,
        "{user:username}": message.author.username,
        "{user:tag}": message.author.tag,
        "{user:id}": message.author.id,
        "{level}": newLevel,
        "{guild}": message.guild.name,
        "{guild:id}": message.guild.id,
      };
      if (r !== undefined) {
        message.member.roles
          .add(role, `The Member Has Reached On Level ${newLevel}`)
          .then(() => {
            if (!Data.Announcements) return;
            if (Data.AnnounceEmbedToggle) {

              const Embed = new EmbedBuilder(Data.AnnounceEmbed);

              if (Data.AnnounceEmbed.title) {
                Embed.setTitle(Data.AnnounceEmbed.title.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ))
              }

              if(Data.AnnounceEmbed.color) {
                Embed.setColor(Data.AnnounceEmbed.color)
              }

              if (Data.AnnounceEmbed.url) {
                Embed.setURL(Data.AnnounceEmbed.url)
              }

              if(Data.AnnounceEmbed.image && Data.AnnounceEmbed.image.url) {
                Embed.setImage(Data.AnnounceEmbed.image.url)
              }





      
              if (Data.AnnounceEmbed.description) {
                Embed.setDescription(Data.AnnounceEmbed.description.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ))
              }

              if (Data.AnnounceEmbed.footer && Data.AnnounceEmbed.footer.text) {
                Embed.setFooter({ text: Data.AnnounceEmbed.footer.text.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ), iconURL: Data.AnnounceEmbed.footer.icon_url || message.author.displayAvatarURL()})
              }

              if (Data.AnnounceEmbed.fields && Data.AnnounceEmbed.fields.length > 0) {
                for (const field of Data.AnnounceEmbed.fields) {
                  Embed.addFields(
                    {
                      name: field.name.replace(
                        /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                        (match) => replacements[match]
                      ),
                      value: field.value.replace(
                        /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                        (match) => replacements[match]
                      ),
                      inline: field.inline
                    }
                  )
                }
              }

              if (Data.AnnounceEmbed.author && Data.AnnounceEmbed.author.name) {
                Embed.setAuthor({ name: Data.AnnounceEmbed.author.name.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ), iconURL: Data.AnnounceEmbed.author.icon_url || message.author.displayAvatarURL(), url: Data.AnnounceEmbed.author.url  })
              }

       
                if (Data.AnnounceEmbedThumbnail !== "None") {
                 if (Data.AnnounceEmbedThumbnail === "AuthorAvatar") {
                    Embed.setThumbnail(message.author.displayAvatarURL({
                      dynamic: true,
                    }))
                  } else if (Data.AnnounceEmbedThumbnail === "guildAvatar") {
                    Embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
                  }
                } else if (Data.AnnounceEmbedThumbnail === "None") {
                 if(Data.AnnounceEmbed.thumbnail && Data.AnnounceEmbed.thumbnail.url) {
            
                  Embed.setThumbnail(Data.AnnounceEmbed.thumbnail)
                 }
                
              }

              if (Data.AnnounceMessage !== "None") {
                const Message = Data.AnnounceMessage.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                );

                channel.send({
                  content: Message,
                  embeds: [Embed],
                });
              } else {
                channel.send({
                  embeds: [Embed],
                });
            }
          } else {
            if(!Data.Announcements) return;
            if(Data.AnnounceMessage !== "None") {
              const Message = Data.AnnounceMessage.replace(
                /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                (match) => replacements[match]
              );

              channel.send({
                content: `${Message}`
              })
            }
          }
        })

          .catch(() => {
            if (!Data.Announcements) return;
            if (Data.AnnounceEmbedToggle) {

              const Embed = new EmbedBuilder(Data.AnnounceEmbed);

              if (Data.AnnounceEmbed.title) {
                Embed.setTitle(Data.AnnounceEmbed.title.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ))
              }

                
                
              if(Data.AnnounceEmbed.color) {
                Embed.setColor(Data.AnnounceEmbed.color)
              }

              if (Data.AnnounceEmbed.url) {
                Embed.setURL(Data.AnnounceEmbed.url)
              }

              if(Data.AnnounceEmbed.image && Data.AnnounceEmbed.image.url) {
                Embed.setImage(Data.AnnounceEmbed.image.url)
              }

                
            
              if (Data.AnnounceEmbed.description) {
                Embed.setDescription(Data.AnnounceEmbed.description.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ))
              }

              if (Data.AnnounceEmbed.footer && Data.AnnounceEmbed.footer.text) {
                Embed.setFooter({ text: Data.AnnounceEmbed.footer.text.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ), iconURL: Data.AnnounceEmbed.footer.icon_url || message.author.displayAvatarURL()})
              }

              if (Data.AnnounceEmbed.fields && Data.AnnounceEmbed.fields.length > 0) {
                for (const field of Data.AnnounceEmbed.fields) {
                  Embed.addFields(
                    {
                      name: field.name.replace(
                        /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                        (match) => replacements[match]
                      ),
                      value: field.value.replace(
                        /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                        (match) => replacements[match]
                      ),
                      inline: field.inline
                    }
                  )
                }
              }

              if (Data.AnnounceEmbed.author && Data.AnnounceEmbed.author.name) {
                Embed.setAuthor({ name: Data.AnnounceEmbed.author.name.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                ), iconURL: Data.AnnounceEmbed.author.icon_url || message.author.displayAvatarURL(), url: Data.AnnounceEmbed.author.url  })
              }

             
                if (Data.AnnounceEmbedThumbnail !== "None") {
                 if (Data.AnnounceEmbedThumbnail === "AuthorAvatar") {
                    Embed.setThumbnail(message.author.displayAvatarURL({
                      dynamic: true,
                    }))
                  } else if (Data.AnnounceEmbedThumbnail === "guildAvatar") {
                    Embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
                  }
                
         else if (Data.AnnounceEmbedThumbnail === "None") {



          if(Data.AnnounceEmbed.thumbnail && Data.AnnounceEmbed.thumbnail.url) {
            
            Embed.setThumbnail(Data.AnnounceEmbed.thumbnail)
           }
                }
              }

              if (Data.AnnounceMessage !== "None") {
                const Message = Data.AnnounceMessage.replace(
                  /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                  (match) => replacements[match]
                );

                channel.send({
                  content: `${Message}\nI couldn't give you the role because I don't have the permissions to do so.`,
                  embeds: [Embed],
                });
              } else {
                channel.send({
                  content: `I couldn't give you the role because I don't have the permissions to do so.`,
                  embeds: [Embed],
                });
            }
          } else {
            if(!Data.Announcements) return;
            if(Data.AnnounceMessage !== "None") {
              const Message = Data.AnnounceMessage.replace(
                /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                (match) => replacements[match]
              );

              channel.send({
                content: `${Message}\nI couldn't give you the role because I don't have the permissions to do so.`
              })
            }
          }
          });
      } else if (r === undefined) {
        if (!Data.Announcements) return;
        if (Data.AnnounceEmbedToggle) {

          const Embed = new EmbedBuilder(Data.AnnounceEmbed);

          if (Data.AnnounceEmbed.title) {
            Embed.setTitle(Data.AnnounceEmbed.title.replace(
              /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
              (match) => replacements[match]
            ))
          }

            
            
          if(Data.AnnounceEmbed.color) {
            Embed.setColor(Data.AnnounceEmbed.color)
          }

          if (Data.AnnounceEmbed.url) {
            Embed.setURL(Data.AnnounceEmbed.url)
          }

          if(Data.AnnounceEmbed.image && Data.AnnounceEmbed.image.url) {
            Embed.setImage(Data.AnnounceEmbed.image.url)
          }

            
         
          if (Data.AnnounceEmbed.description) {
            Embed.setDescription(Data.AnnounceEmbed.description.replace(
              /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
              (match) => replacements[match]
            ))
          }

          if (Data.AnnounceEmbed.footer && Data.AnnounceEmbed.footer.text) {
            Embed.setFooter({ text: Data.AnnounceEmbed.footer.text.replace(
              /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
              (match) => replacements[match]
            ), iconURL: Data.AnnounceEmbed.footer.icon_url || message.author.displayAvatarURL()})
          }

          if (Data.AnnounceEmbed.fields && Data.AnnounceEmbed.fields.length > 0) {
            for (const field of Data.AnnounceEmbed.fields) {
              Embed.addFields(
                {
                  name: field.name.replace(
                    /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                    (match) => replacements[match]
                  ),
                  value: field.value.replace(
                    /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
                    (match) => replacements[match]
                  ),
                  inline: field.inline
                }
              )
            }
          }

          if (Data.AnnounceEmbed.author && Data.AnnounceEmbed.author.name) {
            Embed.setAuthor({ name: Data.AnnounceEmbed.author.name.replace(
              /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
              (match) => replacements[match]
            ), iconURL: Data.AnnounceEmbed.author.icon_url || message.author.displayAvatarURL(), url: Data.AnnounceEmbed.author.url  })
          }

       
            if (Data.AnnounceEmbedThumbnail !== "None") {
             if (Data.AnnounceEmbedThumbnail === "AuthorAvatar") {
                Embed.setThumbnail(message.author.displayAvatarURL({
                  dynamic: true,
                }))
              } else if (Data.AnnounceEmbedThumbnail === "guildAvatar") {
                Embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
              }
            }
            else if (Data.AnnounceEmbedThumbnail === "None") {



              if(Data.AnnounceEmbed.thumbnail && Data.AnnounceEmbed.thumbnail.url) {
            
                Embed.setThumbnail(Data.AnnounceEmbed.thumbnail)
               }
            }
          

          if (Data.AnnounceMessage !== "None") {
            const Message = Data.AnnounceMessage.replace(
              /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
              (match) => replacements[match]
            );

            channel.send({
              content: Message,
              embeds: [Embed],
            });
          } else {
            channel.send({
              embeds: [Embed],
            });
        }
      } else {
        if(!Data.Announcements) return;
        if(Data.AnnounceMessage !== "None") {
          const Message = Data.AnnounceMessage.replace(
            /{user}|{user:username}|{user:tag}|{user:id}|{level}|{guild}|{guild:id}/g,
            (match) => replacements[match]
          );

          channel.send({
            content: `${Message}`
          })
        }
      }
      }

      await UserData.update({
        XP: newXP,
        Level: newLevel,
        LastXp: Date.now(),
      });
    } else 

   { await UserData.update({
      XP: newXP,
      LastXp: Date.now(),
    });}
  },
};