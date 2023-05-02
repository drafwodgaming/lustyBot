const { Client } = require("discord.js");
const consoleLogs = require("../../config/consoleLogs.json");
const chalk = require("chalk");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  process.on("unhandledRejection", (error) => {
    console.log(chalk.red(consoleLogs.unhandledRejection), `${error}`);
  });

  process.on("uncaughtException", (error) => {
    console.log(chalk.red(consoleLogs.uncaughtException), `${error}`);
  });
};
