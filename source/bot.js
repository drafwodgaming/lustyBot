const { Client, REST, Routes, Collection } = require("discord.js");
const botConfig = require("../config/botConfig.json");
const botIntents = require("../config/botIntents");
const fileSystem = require("fs");
const path = require("path");

const client = new Client({ intents: botIntents });
const rest = new REST({ version: botConfig.restVersion }).setToken(
  botConfig.tokenDev
);

client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandsArray = [];

const handlersPath = path.join(__dirname, botConfig.filePath.handlersPath);
const handlersFiles = fileSystem
  .readdirSync(handlersPath)
  .filter((file) => file.endsWith(botConfig.filePath.jsFileExtension));

for (const file of handlersFiles) {
  const filePath = path.join(handlersPath, file);
  require(filePath)(client, __dirname);
}
async function setUpBot() {
  client.eventsHandler();
  client.commandsHandler();
  client.componentsHandler();
  client.login(botConfig.tokenDev);

  await rest.put(Routes.applicationCommands(botConfig.clientIdDev), {
    body: client.commandsArray,
  });
}

setUpBot();
