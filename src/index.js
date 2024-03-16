require("dotenv").config();
const ExtendedClient = require("./class/ExtendedClient");

const client = new ExtendedClient();
const { getXataClient } = require("./handlers/xata");
global.fetch = require("node-fetch")

client.start();


// Handles errors and avoids crashes, better to not remove them.
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
