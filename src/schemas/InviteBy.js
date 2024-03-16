const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    invitedUser: String,
    Inviter: String,
});

module.exports = mongoose.model("inviteBy", Schema);