        const { Message, PermissionFlagBits, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Invites = require('../../../handlers/xata').getXataClient().db.Invites;
module.exports = {
    structure: {
        name: 'remove-invites',
        description: 'remove invites of the user',
       aliases: ["remove-invite", "remove-i", "removei", "remove-inv"],
        permissions: "Administrator",
        category: "Invites",
    },
    
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
            
            if(!args[0] || isNaN(args[0]) ||args[0] < 0) return message.reply('Please provide a valid number');
    
            if(!args[1]) return message.reply('Please provide a user');
    
        
            const user = message.mentions.users.first() || await message.guild.members.fetch(args[1])
            if(!user) return message.reply('Please provide a valid user');
    
   let  Data = await Invites.filter({ Guild: message.guildId, Inviter: user.id }).getFirst();

    if(!Data) {
       await Invites.create({
            Guild: message.guildId,
            Inviter: user.id,
            Invites: 0,
        })


        
    }

    if(Data.Invites < args[0]) return message.reply('User does not have that many invites');
    
  Data.update({
        Invites: Data.Invites -= parseInt(args[0])
              })
    message.reply(`Successfully removed ${args[0]} invites from ${user.tag}`);
                                         
    }
};