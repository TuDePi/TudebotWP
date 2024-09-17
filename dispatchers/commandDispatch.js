const { get } = require('request');

/**
 * This class searches for any command handlers with the message start as their name, or an alias and executes the
 * handler if found.
 */

module.exports = {
   async handle(client, message, cooldowns) {
       // console.log(message.body)
       const profileModel = require('../models/profileSchema')
        // Ignore bot messages and messages that dont start with the prefix defined in the config file
        if(!message.body.startsWith(client.botConfig.prefix)) return;
        // Split commands and arguments from message so they can be passed to functions
        const args = message.body.slice(client.botConfig.prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        // If the command isn't in the  command folder, move on
        const command = client.commands.get(commandName)
            //|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;

        // If the command requires arguments, make sure they're there.
        if (command.args && !args.length) {
            let reply = 'That command requires more details!';

            // If we have details on how to use the args, provide them
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${client.botConfig.prefix}${command.name} ${command.usage}\``;
            }

            // Send a reply from the bot about any error encountered
            return message.reply(reply);
        }

        /**
         * The following block of code handles "cooldowns" making sure that users can only use a command every so often.
         * This is helpful for commands that require loading time or computation, like image requests.
         */
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Map());
        }

        /*
           this part check if the command requires vip perks
        */

        const vipList = [
        'Your-Number-Here@c.us',
        ''
        ];
        let kullanici;

        let konusma = await message.getChat();
        if (konusma.isGroup) {
            kullanici = message.author;
        } else {
            kullanici = message.from;
        }
        function isVip1(userId) {
            return vipList.includes(userId);
        }
        if(command.isVip){
            if(isVip1(kullanici)){

            }else{
                return message.reply('This command requires vip permissions')
            }
        }else{
            
            
        }
        /*
            ends here and continues with cooldown's codes :)
        */
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        
        if (timestamps.has(message.author)) {
            const expirationTime = timestamps.get(message.author) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.`);
            }
        }
        
        timestamps.set(message.author, now);
        setTimeout(() => timestamps.delete(message.author), cooldownAmount);
        /**
         * End cooldown code
         */

        try {
            // Run the command
            command.execute(message, args).catch((err) => {
                console.error(`Failed running command handler ${command.name}: "${err.message}"`)
            });
        } catch(error) {
            console.error(error);
            message.reply('Sorry! I ran into an error trying to do that!');
        }
    }
}