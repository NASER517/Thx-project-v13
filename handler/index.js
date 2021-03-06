const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");

const globPromise = promisify(glob);
const ascii = require('ascii-table');
let table = new ascii(`Commands`);
table.setHeading('Command', 'Load Status');
/**
 * @param {Client} client
 */
module.exports = async (client) => {
  
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
  
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
        
    });
    
        

    


    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/Slashcommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
      
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        //await client.guilds.cache
           // .get("907657070109663292")
            //.commands.set(arrayOfSlashCommands);
      console.log('Started refreshing application (/) commands.');
      await client.application.commands.set(arrayOfSlashCommands);
      console.log("----------------------")
      console.log('Successfully reloaded application (/) commands.');

        // Register for all the guilds the bot is in
        // 
    });

    // mongoose
    
};
