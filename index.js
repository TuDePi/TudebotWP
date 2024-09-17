const fs = require('fs');                   // Loads the Filesystem library
const { Client, LocalAuth, MessageMedia, Chat } = require('whatsapp-web.js');  //load wwebjs lib
const Config = require('./config.json');    // Loads the configuration values
const BotLib = require('./lib/bot.js');
const qrcode = require('qrcode-terminal'); //Prints qr code to terminal (required by wweb js)
const mongoose = require('mongoose'); //mongDB lirary
const path = require('path');


// Loads our dispatcher classes that figure out what handlers to use in response to events
const Keywords = require('./dispatchers/keywordDispatch');
const Commands = require('./dispatchers/commandDispatch');

const { get } = require('request');

const client = new Client({
    authStrategy: new LocalAuth()
}); // Initiates the client

client.botConfig = Config; // Stores the config inside the client object so it's auto injected wherever we use the client
client.botConfig.rootDir = __dirname; // Stores the running directory in the config so we don't have to traverse up directories.


// Loads our handler functions that do all the work
BotLib.loadHandlers(client, 'commands');
BotLib.loadHandlers(client, 'keywords');

//mongoDB connection
mongoose.connect(client.botConfig.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const cooldowns = new Map(); // Creates an empty list for storing timeouts so people can't spam with commands

// Starts the bot and makes it begin listening to events.
client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});



// Handle user messages
client.on('message_create', async (message) => {
    
    // Check for keywords that don't use a real command structure
    if(Keywords.handle(client, message)) {
        //return; // If we handled a keyword, don't continue to handle events for the same message
    }

    // Check for structured commands
    if(Commands.handle(client, message, cooldowns)) {
        return; // If we handled a command, don't continue to handle events for the same message
    }
});



    
// Log the bot in using the token provided in the config file
client.initialize();
module.exports = client;