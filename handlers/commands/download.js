/**
 * This class responds to anyone that types !bot talk and chooses one of the phrases below to respond with at random.
 *
 */

const { MessageMedia, Chat } = require('whatsapp-web.js');
const { isVip } = require('./test.js');
const Instagram = require('instagram-web-api');
const config = require('../../config.json');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'download', // The name of the command
    description: 'Download instagram reels', // The description of the command (for help text)
    //args: true, // Specified that this command doesn't need any data other than the command
    usage: '', // Help text to explain how to use the command (if it had any arguments)
    cooldown: 20,
    isVip: false,
   async execute(message, args) {
    const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const client = require('../../index.js');
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Set download behavior and path
    const downloadPath = path.resolve('./downloads');
    await page._client().send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
    });

    // Navigate to the website
    await page.goto('https://saveclip.app/en/instagram-reels-video-download');
    
    // Wait for the input element and type the search query
    await page.waitForSelector('input[name="q"]');
    await page.type('input[name="q"]', args); // Make sure `args` is defined properly
    await page.waitForTimeout(3000);

    // Click the download button
    await page.click('button.btn.btn-default');
    
    // Wait for the video download button to appear
    await page.waitForSelector('[title="Download Video 1"]');
    
    // Click to initiate download
    await page.click('[title="Download Video 1"]');

    // Wait for the download to complete
    await page.waitForTimeout(10000);

    await browser.close();

    console.log('Browser closed');
    await delay(3000);
    
    // Handle file renaming
    const files = fs.readdirSync(downloadPath);
    if (files.length === 0) {
        throw new Error('No files downloaded.');
    }
    const lastFile = files[files.length - 1];
    const image_url = `${downloadPath}/${lastFile}`;
    console.log(image_url)
    //adds 127.0.0.1/view/ to the image url    
    const media = MessageMedia.fromFilePath(image_url);
    await client.sendMessage(message.from, media);
    message.reply('Downloaded successfully!');


    },
};