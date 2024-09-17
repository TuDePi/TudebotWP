/**
 * This class responds to anyone that types !bot talk and chooses one of the phrases below to respond with at random.
 *
 */
const { default: OpenAI } = require('openai');
//const client = require('../../index.js')
const config = require('../../config.json');
const { MessageMedia } = require('whatsapp-web.js')
const tokenUsed = require('../../models/profileSchema.js');
const { error } = require('qrcode-terminal');
const profileModel = require('../../models/profileSchema.js')
module.exports = {
    name: 'answer', // The name of the command
    description: '', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 0,
    args: true,
   async execute(message, args) {
    const client = require('../../index.js')
    const prompt1 = args.join(" ");
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    let kullanici;

    let konusma = await message.getChat();
    if (konusma.isGroup) {
        kullanici = message.author;
    } else {
        kullanici = message.from;
    }
    let profileData;
    try {
      profileData = await profileModel.findOne({ user: kullanici });
      if (!profileData) {
      let profile = await profileModel.create({
        user: kullanici,
        count: 0,
        cevap: "No answer"
      });
      profile.save();
      }
    }catch (err) {
      console.log(err);}
        // Upload prompt1 as cevap
        profileData.cevap = prompt1
        profileData.save();
        message.reply(`Your answer has been saved as: ${prompt1}`)
        
}
};