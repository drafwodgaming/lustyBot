const fileSystem = require("fs");
const path = require("path");
const botConfig = require("../../config/botConfig.json");
const ascii = require("ascii-table");

module.exports = (client, sourcePath) => {
  client.commandsHandler = async () => {
    const { commands, commandsArray } = client;
    const table = new ascii().setHeading("Commands", "Status");
    const commandsPath = path.join(sourcePath, botConfig.filePath.commandsPath);
    const commandsFiles = fileSystem
      .readdirSync(commandsPath)
      .filter(
        (file) =>
          !file.startsWith("[off]") &&
          file.endsWith(botConfig.filePath.jsFileExtension)
      );

    for (const file of commandsFiles) {
      const commandPath = path.join(commandsPath, file);
      const command = require(commandPath);
      commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());
      table.addRow(command.data.name, "🟩");
    }

    return console.log(table.toString());
  };
};
