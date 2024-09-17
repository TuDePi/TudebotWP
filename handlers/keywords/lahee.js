/**
 * This class responds to anyone that types "ping" or any of the aliases listed below with the gif defined below.
 */
module.exports = {
    name: 'ping', // The name of the keyword to react to,
    aliases: ['ping',], // Other keywords to react to

    // We could respond with text, or any other type of file instead.
    execute(message) {
        return message.reply('Pong!')
    },
};