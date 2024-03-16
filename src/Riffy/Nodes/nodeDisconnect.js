const ExtendedClient = require('../../class/ExtendedClient');
const { Node } = require('riffy');
const { log } = require("../../functions");
/**
 * 
 * @param {ExtendedClient} client 
 * @param {Node} node 
 */
module.exports = async(client, nodes, reason) => {
log("Node:" + nodes.name + " disconnected", "err")
console.log(reason)
}