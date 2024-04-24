const { Telegraf } = require('telegraf');

// Initialize the bot with your bot token
const bot = new Telegraf('7106615757:AAFGnZc6wN-RA9P0vdAxGqtPakYRYdkFgQM');

// Initialize user count
let userCount = 0;

// Define the start command handler
bot.start((ctx) => {
    // Increment user count
    userCount++;

    // Get user information
    const { id, first_name, last_name, language_code } = ctx.from;

    // Prepare the reply message
    const replyMessage = `Chat ID: ${id}\nFirst name: ${first_name}\nLast name: ${last_name}\nLanguage: ${language_code}\nStarted count: ${userCount}`;

    // Send the reply message
    ctx.reply(replyMessage);
});

// Start the bot
bot.launch().then(() => console.log('Bot started'));
