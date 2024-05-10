"use strict"
const TelegramBot = require('node-telegram-bot-api');

const token = '6807636962:AAFnNvr0iyCG80Ta1evpNzx3yKBvXnAmqSw'; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });

let weeklyLimit = 0;
let startDate = null;
let totalSpent = 0;

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText === '/start') {
        bot.sendMessage(chatId, 'Welcome to the spending tracker bot!');
    } else if (messageText.startsWith('/setlimit')) {
        weeklyLimit = parseFloat(messageText.split(' ')[1]);
        bot.sendMessage(chatId, `Weekly limit set to ${weeklyLimit}.`);
    } else if (messageText === '/startweek') {
        startDate = new Date();
        totalSpent = 0;
        bot.sendMessage(chatId, 'New week started!');
    } else if (messageText.startsWith('/spend')) {
        const amountSpent = parseFloat(messageText.split(' ')[1]);
        totalSpent += amountSpent;
        bot.sendMessage(chatId, `You spent ${amountSpent}.`);
        if (totalSpent > weeklyLimit) {
            const difference = totalSpent - weeklyLimit;
            weeklyLimit -= difference;
            bot.sendMessage(chatId, `Weekly limit exceeded! Adjusted to ${weeklyLimit}.`);
        }
    } else if (messageText === '/getstatus') {
        let statusMsg = `Weekly Limit: ${weeklyLimit}\n`;
        statusMsg += `Total Spent: ${totalSpent}\n`;
        statusMsg += `Week Start Date: ${startDate}\n`;
        statusMsg += `Left: ${weeklyLimit - totalSpent}`;
        bot.sendMessage(chatId, statusMsg);
    } else if (messageText === '/help') {
        const helpMsg = `Commands:\n/setlimit [amount] - Set weekly spending limit\n/startweek - Start a new week\n/spend [amount] - Log spending\n/getstatus - Get current status\n/help - Display this help message`;
        bot.sendMessage(chatId, helpMsg);
    }
});