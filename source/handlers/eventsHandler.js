const fileSystem = require("fs");
const path = require("path");
const botConfig = require("../../config/botConfig.json");

module.exports = (client, sourcePath) => {
  client.eventsHandler = async () => {
    const eventsPath = path.join(sourcePath, botConfig.filePath.eventsPath);
    const eventsFiles = fileSystem
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(botConfig.filePath.jsFileExtension));

    for (const file of eventsFiles) {
      const eventPath = path.join(eventsPath, file);
      const event = require(eventPath);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  };
};
