const ExtendedClient = require('../../class/ExtendedClient');
const { Node } = require('riffy');
const { log } = require("../../functions");
/**
 * 
 * @param {ExtendedClient} client 
 * @param {Node} node 
 */
module.exports = async(client, nodes) => {
log("Node:" + nodes.name + " Reconnecting...", "warn")
}