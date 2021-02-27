const { Client, Collection } = require('discord.js');
const nat2k15 = new Client();
const chalk = require('chalk');
const config = require('./config.json')
const fs = require('fs')
const { sep } = require("path");
nat2k15.prefix = config.prefix;
["commands", "aliases"].forEach(x => nat2k15[x] = new Collection());
const commandhandler = (dir = "./commands/") => {
    fs.readdirSync(dir).forEach(dirs => {
        const commands = fs.readdirSync(`${dir}${sep}`).filter(files => files.endsWith(".js"));
        for (const file of commands) {
            const pull = require(`${dir}/${file}`);
            if (pull.help && typeof(pull.help.name) === "string" && typeof(pull.help.category) === "string") {
                if (nat2k15.commands.get(pull.help.name)) return;
                nat2k15.commands.set(pull.help.name, pull);
            }
        }
    });
};
commandhandler();

nat2k15.once('ready', async() => {
    console.log(chalk.red `[MADE BY NAT2K15] ` + chalk.white `${nat2k15.user.tag} is now online!`)
})

nat2k15.on('message', async message => {
    if (message.author.bot) return;
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    //made by NAT2K15
    if (!message.content.startsWith(prefix)) return;
    const commandfile = nat2k15.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(nat2k15, message, args);
})

nat2k15.login(config.token)