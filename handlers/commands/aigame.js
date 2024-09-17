/**
 * This class responds to anyone that types !bot talk and chooses one of the phrases below to respond with at random.
 *
 */

//const client = require('../../index.js')
require('dotenv').config();
const { Client, LocalAuth, MessageMedia, Chat } = require('whatsapp-web.js');  //load wwebjs lib
const { isVip } = require('./test.js');
const { default: OpenAI } = require('openai');
const config = require('../../config.json');
const tokenUsed = require('../../models/profileSchema.js');
const { error } = require('qrcode-terminal');
const profileModel = require('../../models/profileSchema.js');
const { del } = require('request');
module.exports = {
    name: 'game', // The name of the command
    description: 'Starts the game', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 70,
    isVip: false,
   async execute(message, args) {
    const client = require('../../index.js')
    const getmsg1 = require('../../index.js');
    const mention = await message.getMentions();

    const openai = new OpenAI({
        apiKey: config.openai,
    });
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    //random creative apocalypse scenario texts
    const scenarios = [
        "In a post-apocalyptic world, you stumble upon a hidden bunker filled with supplies. What do you do?",
        "You are stranded on a deserted island with limited resources. How do you survive?",
        "A deadly virus has wiped out most of humanity. How do you rebuild society?",
        "Aliens have invaded Earth. How do you defend against them?",
        "A massive earthquake has destroyed your city. How do you help the survivors?",
        "You are the last person on Earth. What do you do?",
        "A zombie outbreak has occurred. How do you survive?",
        "You are a time traveler who has accidentally changed history. How do you fix it?",
        "You are a superhero with incredible powers. How do you use them to save the world?",
        "You are a detective investigating a series of mysterious murders. What do you uncover?",
        "You are a scientist who has discovered a new element with amazing properties. How do you use it?",
        "You are a wizard who has uncovered a powerful spell. How do you use it?",
        "You are a pirate searching for hidden treasure. What do you find?",
        "You are a space explorer who has discovered a new planet. What do you do?",
        "You are a spy on a dangerous mission. How do you complete it?",
        "You are a vampire living in a modern city. How do you hide your true nature?",
        "You are a werewolf trying to control your transformations. How do you keep your secret?",
        "You are a ghost haunting an old mansion. How do you find peace?",
        "You are a robot with human emotions. How do you cope with them?",
        "You are a demon trying to escape from Hell. How do you do it?",
        "You are a dragon protecting your hoard. How do you defend it?",
        "You are a mermaid living in the ocean. How do you interact with humans?",
        "You are a fairy granting wishes to mortals. How do you choose who to help?",
        "You are a goblin causing mischief in a village. How do you avoid getting caught?",
        "You are a troll living under a bridge. How do you deal with unwanted visitors?",
        "You are a wizard's apprentice learning magic. How do you avoid disaster?",
        "You are a superhero's sidekick. How do you support them?",
        "You are a villain plotting to take over the world. How do you succeed?",
        "You are a mad scientist creating a monster. How do you control it?",
        "You are a time traveler visiting the future. What do you discover?",

    ];

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

   async function oyunBasla(scenario2, a1, a2, p1, p2) {
        const messages = [
            {"role": "system", "content": "You are a game moderator that chooses which player survives in the choosen situation."},
            {"role": "system", "content": "You are in a zombie apocalypse and you have to choose which player survives with the best answer."},
            {"role": "user", "content": "Player1: i will hide to the nearest building."},
            {"role": "user", "content": "Player2: i would kill them with my guns."},
            {"role": "assistant", "content": "In a zombie apocalypse scenario, Player1's approach of hiding in the nearest building seems to be the most sensible. While Player2's aggressive tactic may work in some situations, it could also draw more attention and lead to increased danger. Hiding allows for a more strategic approach, preserving resources and assessing the situation before making any moves\nTherefore, Player1 survives."},

            {"role": "assistant", "content": "In this scenario, Player1's approach of $PLAYER1_ANSWER_REASON$ seems to be the most effective. While Player2's strategy of $PLAYER2_ANSWER_REASON$ may have its merits, it is not as practical in this situation. Therefore, Player1 survives."},
            {"role": "system", "content": "Don't compare language, just choose the best answer and make fun and creative answers more liveable."},
            {"role": "system", "content": "You are faced with the following scenario: " + scenario2},
            {"role": "user", "content": a1+": "+ p1},
            {"role": "user", "content": a2+": "+ p2},
        ];
    
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4o-mini",
        });
        message.reply(completion.choices[0].message.content);
    }
    const mentions = await message.getMentions();
    const prompter = await message.getContact();
    for (let user of mentions) {
        let userNum = user.number+ "@c.us";
        let prompterNum = prompter.number+ "@c.us";
        message.reply(`*${user.pushname}* and *${prompter.pushname}* dm me your answers for the following scenario:\n\n(!answer {Your Answer}) \n\n*${randomScenario}*`); await delay(1000);
        message.reply(`You have *90* seconds to respond`);
        await delay(60000);
        message.reply(`*30* seconds remaining`);
        await delay(15000);
        message.reply(`*15* seconds remaining`);
        await delay(15000);
        

        //Profiledata
     let profileData;
     try {
     profileData = await profileModel.findOne({ user: userNum });
     if (!profileData) {
     let profile = await profileModel.create({
         user: userNum,
         count: 0,
         cevap: "test"
     });
     profile.save();
     message.reply('Created database. Execute command again!')
     }
     }catch (err) {
     console.log(err);}
     const parası = profileData.cevap
        //Profiledata
     try {
     profileData = await profileModel.findOne({ user: prompterNum });
     if (!profileData) {
     let profile = await profileModel.create({
         user: prompterNum,
         count: 0,
         cevap: "test"
     });
     profile.save();
     message.reply('Created database. Execute command again!')
     }
     }catch (err) {
     console.log(err);}
     const parası2 = profileData.cevap
        const p1 = parası;
        const p2 = parası2;
        delay(5000);
        oyunBasla(randomScenario, user.pushname, prompter.pushname, p1, p2);
        
    }
    // Now you can access the users array outside the loop
    
    
    
    },
};