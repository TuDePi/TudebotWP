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
const fs = require('fs');
const path = require('path');
const { promiseHooks } = require('v8');

module.exports = {
    name: 'tts', // The name of the command
    description: 'test', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 5,
    isVip: true,
    args: true,
   async execute(message, args) {
    const prompt1 = args.join(" ");
    const openai = new OpenAI({
        apiKey: config.openai2,
    });
    const prompt = args.join(" ");
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    const client = require('../../index.js')
    function getUniqueFileName() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return path.resolve(`./konusma/speech-${timestamp}.mp3`);
      }
      
      async function main11() {
        // Generate a unique file name
        const speechFile = getUniqueFileName();
      
        // Request to generate speech from text
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "nova",
          input: prompt1,
        });
        // Convert the response to a Buffer
        const buffer = Buffer.from(await mp3.arrayBuffer());
      
        // Write the Buffer to the file
        await fs.promises.writeFile(speechFile, buffer);
      
        const media2 = MessageMedia.fromFilePath(speechFile);
        await client.sendMessage(message.from, media2, { sendAudioAsVoice: true });
        delay(5000);
        await fs.promises.unlink(speechFile);
        
      }
      
      // Execute the main function
      main11();
    },
};