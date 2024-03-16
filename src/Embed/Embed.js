const {  EmbedBuilder } = require('discord.js');

module.exports = (args, oldEmbed) => {

  
  const parameter = args.join(' ');
  const success = []; 
  const fails = []; 
  const validModifiers =  [
    '{avatar}',
    '{avatarDynamic}',
    '{guildIcon}',
    '{guildIconDynamic}',
    '{guildOwnerAvatar}',
    '{guildOwnerAvatarDynamic}',
    '{userAvatar}',
    '{userAvatarDynamic}'
  ];

  const embedProps = {
    authorImageURL: matchFor('-author=image', parameter),
    authorName: matchFor('-author=name', parameter),
    authorURL: matchFor('-author=url', parameter),
    title: matchFor('-title', parameter),
    url: matchFor('-url', parameter),
    description: matchFor('-description', parameter),
    thumbnail: matchFor('-thumbnail', parameter),
    color: matchFor('-color', parameter),
    image: matchFor('-image', parameter),
    footerText: matchFor('-footer=text', parameter),
    footerImage: matchFor('-footer=image', parameter),
    fields: [], 

  };

  const urlServices = [
    'authorImageURL',
    'authorURL',
    'footerImage',
    'image',
    'thumbnail',
    'url',
  ];

  const limits = {
    title: 256,
    description: 2048,
    authorName: 256,
    footerText: 2048
  };


  const fieldsMatch = parameter.match(/-field:name:\[.*?\] -field:value:\[.*?\] -field:inline:\[.*?\]/g);
  if (fieldsMatch) {
    embedProps.fields = fieldsMatch.map((field) => {
      const nameMatch = field.match(/-field:name:\[(.*?)\]/);
      const valueMatch = field.match(/-field:value:\[(.*?)\]/);
      const inlineMatch = field.match(/-field:inline:\[(.*?)\]/);

      return {
        name: nameMatch ? nameMatch[1] : '',
        value: valueMatch ? valueMatch[1] : '',
        inline: inlineMatch ? inlineMatch[1].toLowerCase() === 'true' : false,
      };
    });
  }


  for (const [key, val] of Object.entries(embedProps)){
    if (!urlServices.includes(key)){
      
      continue;
    } else if (!val){
    
      continue;
    } else {
      
      if (websiteTest(val)){
    
        success.push(`**Embed#${key}** has successfully been set!`);
      } else if (validModifiers.includes(val.trim())){
        success.push(`**Embed#${key}** has successfully been set (Modifier)!`);
        success.push(`**Embed#${key}** has successfully been removed!`);
      } else {
      
        embedProps[key] = null;
        fails.push(`The provided **${key}** is invalid. Please ensure the validity of the URL.`);
      };
    };
  };



  if (embedProps.color?.match(/#[a-f0-9]{6}/i)){
    embedProps.color = undefined;
    fails.push('The provided **Color Hex Code** is invalid. Please make sure you are passing a valid Hex Code');
  } else if (embedProps.color){
    success.push('**Embed#color** has successfully been set!')
  };


  for (const [key, val] of (Object.entries(embedProps))){
    if (!['authorName', 'title', 'description', 'footerText'].includes(key)){
      continue;
    } else if (!val){
      continue;
    } else if (val.length > limits[key]){
      embedProps[key] = undefined;
      fails.push(`Embed **${key}** is only limited to **${limits[key]}** characters. Yours have **${val.length}**`);
    } else {
      success.push(`**Embed#${key}** has successfully been set!`);
    };
  };



  if (!success.length){
    if (!fails.length){
      return { error: 'NO_EMBED_OPTIONS', success, fails };
    } else {
      return { error: 'EMBED_OPTIONS_INVALID', success, fails };
    };
  } else {

    const embed = new EmbedBuilder(oldEmbed || {})

    embed.setAuthor({
      name: embedProps.authorName !== undefined ? embedProps.authorName : null,
      iconURL: isEmpty(embedProps.authorImageURL, embed.author?.iconURL),
      url: isEmpty(embedProps.authorURL, embed.author?.url),
  })
  
  
    .setTitle(
      embedProps.title || embed.title || null
    )
    .setURL(
      isEmpty(embedProps.url, embed.url)
    )
    .setThumbnail(
      isEmpty(embedProps.thumbnail, embed.thumbnail?.url)
    )
    .setDescription(
      embedProps.description || embed.description || null
    )
    .setImage(
      isEmpty(embedProps.image, embed.image?.url)
    )
    .setColor(
      embedProps.color ? parseInt(embedProps.color.replace('#', ''), 16) : 0xFFC8DD
    )
    
    .setFooter(
  {    text: embedProps.footerText || embed.footer?.text || null,
     iconURL:  isEmpty(embedProps.footerImage, embed.footer?.iconURL),}
    );



    if (embedProps.fields && embedProps.fields.length > 0) {
        const processedFields = embedProps.fields.slice(0, 25).map((field) => {
          return {
            name: field.name || null,
            value: field.value || null,
            inline: field.inline || false,
          };
        });
  
        embed.addFields(...processedFields);
      }

    return { embed, success, fails };
  };
};


function matchFor(option, str){
  return str.match(new RegExp('(?<=' + option + ':\\[)[\\s\\S]+?(?=])', 'g'))?.[0];
};


function websiteTest(str){
  return !!(str.match(/https?:\/\/[\w\d-.]{4,}\/?([\w\d:%_\+.~#?&/=-]{1,})?/g))
};

function isEmpty(str = null, other){
  return str?.trim() === '' ? null : str?.trim() || other || null;
};