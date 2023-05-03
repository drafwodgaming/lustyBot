const locales = require("../../../config/locales");

function getCommandLocalization(command, language) {
  const commandLocalization = locales[language]?.commands?.[command];
  if (!commandLocalization) {
    throw new Error(`Unsupported language or command: ${language}.${command}`);
  }
  return commandLocalization;
}
module.exports = getCommandLocalization;
