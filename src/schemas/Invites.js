const { model, Schema } = require("mongoose")

module.exports = model("Invites", new Schema({

    Guild: String,
    Inviter: String,
    Invites: { type: Number, default: 0},
    Leave: { type: Number, default: 0},
    Fake: { type: Number, default: 0},
    Rejoin: { type: Number, default: 0},
    
}))