const { Schema, model } = require('mongoose');

module.exports = model("ClientDB", new Schema({
    Client: Boolean,
    Memory: Array,
}))