const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "NNNNNNNN:NNNNN";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, а ты попробуй её отгадать!");
    const ramdomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = ramdomNumber;
    await bot.sendMessage(chatId, "Отгадывай!", gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: "/start", description: "Начальное приветствие" },
        { command: "/keys", description: "Показать клавиатуру" },
    ]);

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            const firstName = msg.from.first_name;
            await bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/192/33.webp");
            await bot.sendMessage(chatId, `Привет, ${firstName}!\nДобро пожаловать на игру!`);
            return startGame(chatId);
        }

        if (text === "/keys") {
            return bot.sendMessage(chatId, "Отгадывай!", gameOptions);
        }

        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");

    });

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === "/again") {
            await startGame(chatId);
        }

        else if (data == chats[chatId]) {
            await bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/192/83.webp");
            await bot.sendMessage(chatId, `Поздравляю, вы выиграли! Загаданная цифра была ${data}`, againOptions);
        }
        else if (data > chats[chatId]){
            await bot.sendMessage(chatId, `Увы, загаданная цифра меньше ${data}`);
        } else {
            await bot.sendMessage(chatId, `Не угадали, загаданная цифра больше ${data}`);
        }
        return bot.answerCallbackQuery(msg.id);

    });
};

start();
