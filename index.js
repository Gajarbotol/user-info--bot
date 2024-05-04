const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather on Telegram.
const bot = new TelegramBot('7106615757:AAFGnZc6wN-RA9P0vdAxGqtPakYRYdkFgQM', { polling: true });

// User counter and threshold
let userCount = 0;
const threshold = 100; // Change this to your desired threshold

// Your chat ID where you want to receive the congratulatory message
const yourChatId = '5197344486'; // Replace with your actual chat ID

// Language dictionary
const language = {
  en: {
    greeting: "Hello! I'm your friendly bot. Please choose your preferred language:",
    options: {
      english: "English 🇬🇧",
      bengali: "বাংলা 🇧🇩"
    },
    selected: "Language selected: English 🇬🇧"
  },
  bn: {
    greeting: "হ্যালো! আমি আপনার ফ্রেন্ডলি বট। আপনার পছন্দের ভাষা নির্ধারণ করুন:",
    options: {
      english: "English 🇬🇧",
      bengali: "বাংলা 🇧🇩"
    },
    selected: "নির্বাচিত ভাষা: বাংলা 🇧🇩"
  }
};

// User language preference storage
const userLanguage = {};

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!userLanguage[userId]) {
    bot.sendMessage(chatId, language.en.greeting, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: language.en.options.english, callback_data: 'en' },
            { text: language.en.options.bengali, callback_data: 'bn' }
          ]
        ]
      }
    });
  } else {
    const lang = userLanguage[userId];
    const response = `${language[lang].greeting}\n\n${language[lang].selected}`;
    bot.sendMessage(chatId, response);
  }

  // Increment user count and check threshold
  userCount++;
  if (userCount === threshold) {
    bot.sendMessage(yourChatId, `Congratulations! Your bot has reached ${threshold} users.`);
  }
});

// Handle language selection callback
bot.on('callback_query', (query) => {
  const userId = query.from.id;
  const lang = query.data;
  userLanguage[userId] = lang;
  const response = `${language[lang].greeting}\n\n${language[lang].selected}`;
  bot.sendMessage(query.message.chat.id, response);
});
