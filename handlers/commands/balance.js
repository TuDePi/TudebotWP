//const client = require('../../index.js')
const { MessageMedia, Chat } = require('whatsapp-web.js');
const { isVip } = require('./test.js');
const profileModel = require('../../models/profileSchema.js')
module.exports = {
    name: 'balance', // The name of the command
    description: 'Check your balance', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 5,
   async execute(message, args) {
    let kullanici;

    let konusma = await message.getChat();
    if (konusma.isGroup) {
        kullanici = message.author;
    } else {
        kullanici = message.from;
    }
     //Profiledata
     let profileData;
     try {
     profileData = await profileModel.findOne({ user: kullanici });
     if (!profileData) {
     let profile = await profileModel.create({
         user: kullanici,
         count: 0,
     });
     profile.save();
     message.reply('Created database. Execute command again to check your balance!')
     }
     }catch (err) {
     console.log(err);}
     const parası = profileData.count
     
        message.reply(`You currently have *${parası}* token(s).`)

    },
};