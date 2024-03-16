const { log } = require("../../functions");
const ExtendedClient = require('../../class/ExtendedClient');
const osUtils = require("os-utils");
const ms = require("ms");
const DB = require('../../schemas/clientsts');
const Track = require("../../handlers/xata").getXataClient().db.Track;

module.exports = {
    event: 'ready',
    once: true,
    /**
     * 
     * @param {ExtendedClient} client
     * @returns 
     */
    run: async (client) => {

      try {
        const deleted = await Track.getAll();
        deleted.forEach(async (track) => {
          await track.delete();
        });
        console.log('All Track records deleted successfully');
      } catch (error) {
        console.error('Error deleting records:', error);
      }
    
let memArray = [];

setInterval(async () => {

  memArray.push((osUtils.totalmem() - osUtils.freemem()) / 1024);

  if (memArray.length >= 14) {
    memArray.shift();
  }


  await DB.findOneAndUpdate({
      Client: true,
    }, {
      Memory: memArray,
    }, {
      upsert: true,
    });
}, ms("5s")); 

        log('Logged in as: ' + client.user.tag, 'done');
       
    }
};