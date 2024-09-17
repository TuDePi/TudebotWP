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
    name: 'draw', // The name of the command
    description: 'Draws your prompt', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '!draw (Your prompt)', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 5,
    args: true,
   async execute(message, args) {
    
    const client = require('../../index.js')
    const prompt1 = args.join(" ");
    const openai = new OpenAI({
        apiKey: config.openai2,
    });
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
      });
      profile.save();
      }
    }catch (err) {
      console.log(err);}
      
        if(profileData.count >= 1){
          async function incrementCommandUsage(kullanici) {
            try {
                const result = await tokenUsed.findOneAndUpdate(
                    { user: kullanici },
                    { $inc: { count: -1 } },
                    { new: true, upsert: true } // Create if not exists
                );
                console.log(`'${kullanici}' has ${result.count} tokens now.`);
            } catch (error) {
                console.error('Error updating command usage:', error);
            }
        }
        async function decrementCommandUsage(kullanici) {
          try {
              const result = await tokenUsed.findOneAndUpdate(
                  { user: kullanici },
                  { $inc: { count: +1 } },
                  { new: true, upsert: true } // Create if not exists
              );
              console.log(`'${kullanici}' has ${result.count} tokens now.`);
          } catch (error) {
              console.error('Error updating command usage:', error);
          }
      }const result1 = await tokenUsed.findOneAndUpdate(
        { user: kullanici },
        { new: true, upsert: true } // Create if not exists
    );

        const adamaAt = result1.count - 1;
        message.react('👍')
        message.reply(`Generating your image...\nYou have ${adamaAt} token(s) left in your wallet.`)
        incrementCommandUsage(kullanici)
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt1,
            n: 1,
            size: "1024x1024",
          });
          image_url = response.data[0].url;
          //handle errors
          const media = await MessageMedia.fromUrl(image_url);
        await client.sendMessage(message.from, media, { caption: `Your prompt was:\n*${prompt1}*\n\n _This command is still in the beta and results can be wrong!_` });


        }else{
          message.reply("You don't have any tokens!")
          return;
        }
    },
};