/**
 * This class responds to anyone that types !bot talk and chooses one of the phrases below to respond with at random.
 *
 */

//const client = require('../../index.js')
const { MessageMedia, Chat } = require('whatsapp-web.js');
const { isVip } = require('./test.js');
const { args } = require('./draw.js');
const { default: OpenAI } = require('openai');
const tokenUsed = require('../../models/profileSchema.js');
const profileModel = require('../../models/profileSchema.js')
const config = require('../../config.json');

module.exports = {
    name: 'ask', // The name of the command
    description: 'test', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 5,
    isVip: true,
    args: true,
   async execute(message, args) {
    const openai = new OpenAI({
        apiKey: config.openai,
    });
    const prompt = args.join(" ");
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    const client = require('../../index.js')
    async function cevap() {
        const completion = await openai.chat.completions.create({
          messages: [
              {"role": "system", "content": "You are a cheerfull and helpfull assistant"},
              {"role": "user", "content": prompt}
            ],
          model: "gpt-4o-mini",
          max_tokens: 500,
        });
      
        message.reply(completion.choices[0].message.content);
      }
      cevap();
    },
};