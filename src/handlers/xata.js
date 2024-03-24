"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXataClient = exports.XataClient = void 0;
// Generated by Xata Codegen 0.29.3. Please do not edit.
const client_1 = require("@xata.io/client");
/** @typedef { import('./types').SchemaTables } SchemaTables */
/** @type { SchemaTables } */
const tables = [
  {
    name: "GuildSchema",
    columns: [
      { name: "prefix", type: "string" },
      { name: "TwentyFourSeven", type: "bool" },
      { name: "Autoplay", type: "bool" },
    ],
  },
  {
    name: "Invites",
    columns: [
      { name: "Guild", type: "string" },
      { name: "Inviter", type: "string" },
      { name: "Invites", type: "int", defaultValue: "0" },
      { name: "Left", type: "int", defaultValue: "0" },
      { name: "Rejoin", type: "int", defaultValue: "0" },
      { name: "Fake", type: "int", defaultValue: "0" },
      { name: "Joins", type: "int", defaultValue: "0" },
    ],
  },
  {
    name: "InviteBy",
    columns: [
      { name: "Guild", type: "string" },
      { name: "Inviter", type: "string" },
      { name: "Member", type: "string" },
    ],
  },
  {
    name: "Autoname",
    columns: [
      { name: "Toggle", type: "bool", defaultValue: "false" },
      { name: "Name", type: "string" },
    ],
  },
  {
    name: "Playlist",
    columns: [
      { name: "name", type: "string" },
      { name: "created", type: "int" },
      { name: "tracks", type: "multiple" },
      { name: "Private", type: "bool" },
      { name: "owner", type: "string" },
    ],
  },
  {
    name: "Level",
    columns: [
      { name: "Toggle", type: "bool" },
      { name: "AnnounceChannel", type: "string" },
      { name: "LevelRewards", type: "json" },
      { name: "XPTimeout", type: "int", defaultValue: "10000" },
      { name: "XPRate", type: "int", defaultValue: "1" },
      { name: "IgnoreXP", type: "multiple" },
      { name: "ExtraXP", type: "multiple" },
      { name: "Announcements", type: "bool" },
      { name: "Uplimit", type: "int", defaultValue: "20" },
      { name: "LowLimit", type: "int", defaultValue: "5" },
      {
        name: "AnnounceEmbedThumnail",
        type: "string",
        notNull: true,
        defaultValue: "None",
      },
      { name: "AnnounceEmbedToggle", type: "bool", defaultValue: "true" },
      {
        name: "AnnounceEmbed",
        type: "json",
        defaultValue:
          '{\n        "type": "rich",\n        "color": 16777215,\n        "title": "Some One Got New Level YaY!",\n        "description": "Hello {user} You Have Been Now Level Up To {level}!",\n        "content_scan_version": 0\n      }',
      },
      { name: "AnnounceMessage", type: "string", defaultValue: "{user}" },
    ],
  },
  {
    name: "UserXP",
    columns: [
      { name: "Guild", type: "string", defaultValue: "0" },
      { name: "User", type: "string", defaultValue: "0" },
      { name: "XP", type: "int", defaultValue: "0" },
      { name: "Level", type: "int", defaultValue: "0" },
      { name: "LastXp", type: "int" },
    ],
  },
  {
    name: "Track",
    columns: [
      { name: "Guild", type: "string" },
      { name: "Track", type: "string" },
      { name: "Message", type: "string" },
      { name: "Channel", type: "string" },
    ],
  },
  {
    name: "Player",
    columns: [
      { name: "Voice", type: "string" },
      { name: "Text", type: "text" },
      { name: "Message", type: "string" },
    ],
  },
  { name: "NoPrefix", columns: [{ name: "Users", type: "multiple" }] },
];
/** @type { import('@xata.io/client').ClientConstructor<{}> } */
const DatabaseClient = (0, client_1.buildClient)();
const defaultOptions = {
  databaseURL:
   process.env.XATA_DATABASE,
};
/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
class XataClient extends DatabaseClient {
  constructor(options) {
    super({ ...defaultOptions, ...options }, tables);
  }
}
exports.XataClient = XataClient;
let instance = undefined;
/** @type { () => XataClient } */
const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient();
  return instance;
};
exports.getXataClient = getXataClient;
