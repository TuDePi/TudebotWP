/**
 * This class searches for any keyword handlers with the message content as their name, or an alias and executes the
 * handler if found.
 */
const { MessageMedia, Chat } = require('whatsapp-web.js');
const { default: OpenAI } = require('openai');
const tokenUsed = require('../models/profileSchema.js');
const profileModel = require('../models/profileSchema.js')
const config = require('../config.json');
module.exports = {
    async handle(client, message) {
        const messageContent = message.body.trim();
        const keyword = client.keywords.get(messageContent)
//-----------------------------------------------------------------------------------------------------
let konusma = await message.getChat();
if (konusma.isGroup || message.fromMe) {
    
} else {
    const openai = new OpenAI({
        apiKey: config.openai,
    });
    const prompt = messageContent;
    const client = require('../index.js')
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
}
//-----------------------------------------------------------------------------------------------------
           // || client.keywords.find(kwd => kwd.aliases && kwd.aliases.includes(messageContent));
        if(keyword) {
            try {
                // Run the command
                keyword.execute(message).catch((err) => {
                    console.error(`Failed running keyword handler ${keyword.name}: "${err.message}"`)
                });
                return true;
            } catch(error) {
                console.error(error);
            }

            return false;
        }
    }
}