module.exports = {
  client: {
    token: "Your Bot token (USE .env FOR SAFETY)",
    id: "Your Bot ID (USE .env FOR SAFETY)",
  },
  handler: {
    prefix: "a.",
    deploy: true,
    commands: {
      prefix: true,
      slash: true,
      user: false,
      message: true,
    },
    mongodb: {
      uri: "Your MongoDB URI string (USE .env FOR SAFETY)",
      toggle: true,
    },
  },
  users: {
    developers: ["1051806381461745664"],
  },
  messageSettings: {
    nsfwMessage: "Naughty Hora Ke, Nuaghty Hora (Not A NSFW Channel)",
    developerMessage: "You are not authorized to use this command.",
    cooldownMessage: "Slow down buddy! You're too fast to use this command. Use command after 7 second (Thala For A Reason)",
    notHasPermissionMessage:
      "Hey Bro Stop It, Get Some Help. You Didn't Have Permission To Use It",
    missingDevIDsMessage:
      "Ase Kya Dekh rha he tere liye nhi he command ye",
  },
};
