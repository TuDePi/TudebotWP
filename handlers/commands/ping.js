/**
 * This class responds to anyone that types !bot talk and chooses one of the phrases below to respond with at random.
 *
 */

//const client = require('../../index.js')
const { MessageMedia, Chat } = require('whatsapp-web.js');
const { isVip } = require('./test.js');
const { default: OpenAI } = require('openai');
const tokenUsed = require('../../models/profileSchema.js');
const profileModel = require('../../models/profileSchema.js')
module.exports = {
    name: 'ping', // The name of the command
    description: 'test', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 5,
    isVip: true,
   async execute(message, args) {
    const client = require('../../index.js')
        message.reply('pong!')
    },
};