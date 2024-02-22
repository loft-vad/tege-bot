const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const token = '6769973149:AAGakbp0oQ2gJSduWbEO8JrjdrYAuc6MjXM' // token generated in @BotFather

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Я загадал цифру от 1 до 9 - угадай какую?`)
  const randomNumber = Math.floor(Math.random() * 10) // *10 bcs random returns float number 0.12 etc. => floor 
  chats[chatId] = randomNumber + ''
  await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Start' },
    { command: '/info', description: 'Info' },
    { command: '/game', description: 'Можно поиграть в угадайку' },
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/54a/0c7/54a0c7cb-5a0b-4beb-8cff-a433eb8b4cca/4.webp')
      return bot.sendMessage(chatId, 'Добро пожаловать!')
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Не понятно')
  })

  bot.on('callback_query', msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === 'again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, 'Правильно!', againOptions)
    } else {
      bot.sendMessage(chatId, `Думаешь, это ${data}?`)
      return bot.sendMessage(chatId, 'Не правильно', againOptions)
    }

  })
}

start()