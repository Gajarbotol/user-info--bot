const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather on Telegram.
const bot = new TelegramBot('7106615757:AAFGnZc6wN-RA9P0vdAxGqtPakYRYdkFgQM', { polling: true });

// Language dictionary
const language = {
  en: {
    greeting: "Hello!",
    user_info: "User Info",
    chat_id: "Chat ID:",
    first: "First:",
    last: "Last:",
    lang: "Language:",
    profile_pic: "Profile Pic",
    help: "Commands:\n/start - Display user information\n/help - Show this help message\n/photo - Show user's profile picture\n/language <lang_code> - Change bot language"
  },
  bn: {
    greeting: "হ্যালো!",
    user_info: "ব্যবহারকারীর তথ্য",
    chat_id: "চ্যাট আইডি:",
    first: "নামের প্রথম অংশ:",
    last: "নামের শেষ অংশ:",
    lang: "ভাষা:",
    profile_pic: "প্রোফাইল ছবি",
    help: "কমান্ডসমূহ:\n/start - ব্যবহারকারীর তথ্য প্রদর্শন\n/help - এই সাহায্য বার্তা প্রদর্শন\n/photo - ব্যবহারকারীর প্রোফাইল ছবি প্রদর্শন\n/language <lang_code> - বটের ভাষা পরিবর্তন"
  }
};

// Store user's language preference
const userLanguage = {};

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!userLanguage[userId]) {
    bot.sendMessage(chatId, "Please select your preferred language:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "English", callback_data: "en" }],
          [{ text: "বাংলা", callback_data: "bn" }]
        ]
      }
    });
  } else {
    sendUserInfo(chatId, msg.from);
  }
});

// Handle language selection
bot.on("callback_query", (query) => {
  const userId = query.from.id;
  const langCode = query.data;
  userLanguage[userId] = langCode;
  bot.answerCallbackQuery(query.id);
  bot.sendMessage(query.message.chat.id, `Your language preference has been set to: ${langCode}`);
  sendUserInfo(query.message.chat.id, query.from);
});

// Function to send user info
function sendUserInfo(chatId, user) {
  const userId = user.id;
  const firstName = user.first_name;
  const lastName = user.last_name || "ㅤㅤ";
  const lang = userLanguage[userId] || "en";
  const profilePic = user.photo ? user.photo.small_file_id : "No profile pic";

  const response = `${language[lang].greeting}\n${language[lang].user_info}\n${language[lang].chat_id} ${chatId}\n${language[lang].first} ${firstName}\n${language[lang].last} ${lastName}\n${language[lang].lang} ${lang}\n${language[lang].profile_pic}: ${profilePic}`;

  bot.sendMessage(chatId, response);
}

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const lang = userLanguage[msg.from.id] || "en";
  const response = language[lang].help;
  bot.sendMessage(chatId, response);
});

// Handle /photo command
bot.onText(/\/photo/, (msg) => {
  const chatId = msg.chat.id;
  const profilePic = msg.from.photo ? msg.from.photo.big_file_id : "No profile pic";
  bot.sendPhoto(chatId, profilePic);
});

// Handle /language command
bot.onText(/\/language (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const langCode = match[1];
  const userId = msg.from.id;
  userLanguage[userId] = langCode;
  bot.sendMessage(chatId, `Language changed to: ${langCode}`);
});
