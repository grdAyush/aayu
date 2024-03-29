const { EmbedBuilder } = require('discord.js');
const _embed = require('./embed');

function error(message, options = {}){
  return message.channel.send(
    new EmbedBuilder()
    .setColor('RED')
    .setFooter({ text: `${options.type} | \©️${new Date().getFullYear()} Aayu`})
    .setDescription([
      `❌\u2000\u2000|\u2000\u2000${options.title}\n\n`,
      options.subtitle ? options.subtitle + '\n' : '',
      `[**Learn More**](${options.source}) on how to configure Aayu's ${options.type} feature.`
    ].join(''))
  );
};

function saveDocument(document, message, options = {}){
  return document.save()
  .then(() => message.channel.send(
    new EmbedBuilder()
    .setColor('GREEN')
    .setFooter({ text: `${options.type} | \©️${new Date().getFullYear()} Aayu`})
    .setDescription([
      `<a:animatedcheck:1195285301350895717>\u2000\u2000|\u2000\u2000${options.title}\n\n`,
      options.subtitle ? options.subtitle + '\n' : '',
      `[**Learn More**](${options.source}) on how to configure Aayu's ${options.type} feature.`
    ].join(''))
  ));
};

function parseMessage(str, variables){
  const test = new RegExp(Object.keys(variables).map((k) => {
    return `(${k})`
  }).join('|'), 'g')
  return str.replace(test, function(match){
    return variables[match];
  });
};

function checkStats(str){
  return str.match(/default|(msg|embed)=true|(msg|embed)=set|test/)
}

function embed(...args){
  return _embed(...args);
};

module.exports = {
  error, saveDocument, parseMessage, checkStats, embed
};