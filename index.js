require('dotenv').config();
const Discord = require('discord.js');
const Command = require('./model.js');
const MicModuleRegister = require('./mic.js');
const FlowerModuleRegister = require('./flower.js');
const client = new Discord.Client();

const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');

app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
app.listen(4000);
// setInterval(() => {
//     http.get(`http://miy123-reborn-taitai.glitch.me/`);
// }, 280000);

Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('/');
};

client.on('ready', async () => {
    console.log('connect' + client.user.tag);

    client.user.setActivity('華山跳跳羊', { type: 'WATCHING' });

    let channels = [];
    client.guilds.cache.forEach(guild => {
        // console.log(`${guild.id}-${guild.name}`);
        guild.channels.cache.forEach(channel => {
            if (channel.type === 'text')
                channels.push({ id: channel.id, name: channel.name, group: channel.parentID });
            // console.log(`${channel.parentID}-${channel.name}-${channel.type}-${channel.id}`);
        });
    });

    registerCommand(MicModuleRegister(channels));
    registerCommand(FlowerModuleRegister());
});

const commandManager = [
    new Command('help', (receivedMessage, commandArguments, param) => {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .addFields(
            { name: 'base command list', value: `
            !hello   --say hello to you
            !roll    --get random number
            !劍純行為 --emm you know that
            !花價
            ` }
        )
        .setAuthor('created by 蒼冥賦流', 'https://truth.bahamut.com.tw/s01/201809/84d4cecc5e01510dbb62523629e4c769.JPG', '')
        .setTimestamp();
        receivedMessage.channel.send(exampleEmbed);
    }, {}),
    new Command('hello', async (receivedMessage, commandArguments, param) => {
        let responseMessage;
        if (!commandArguments)
            responseMessage = `hello ${receivedMessage.author.toString()} :)`;
        else {
            const users = [];
            await commandArguments.forEach(async (x) => {
                await client.users.fetch(x)
                    .then((y) => {
                        users.push(y.toString());
                    });
            });

            responseMessage = `hello ${users.toString()} :)`;
        }
        receivedMessage.channel.send(responseMessage);
    }, {}),
    new Command('roll', (receivedMessage, commandArguments, param) => {
        receivedMessage.channel.send(`${receivedMessage.author.toString()} 擲出了 ${Math.floor(Math.random() * 101)}。（0-100）`);
    }, {}),
    new Command('劍純行為', (receivedMessage, commandArguments, param) => {
        receivedMessage.channel.send(`女人影響我出劍的速度。`);
    }, {}),
    new Command('創建時間', (receivedMessage, commandArguments, param) => {
        receivedMessage.channel.send(`${receivedMessage.author} 創建於 ${receivedMessage.author.createdAt.yyyymmdd()}`);
    }, {}),
    new Command('members', (receivedMessage, commandArguments, param) => {
        console.log(receivedMessage.guild.members);
    }, {}),
    new Command('胖虎', (receivedMessage, commandArguments, param) => {
        receivedMessage.channel.send(`
        ⠄⠄⠄⠄⠄⠄⠄⠄⢀⣀⣤⣤⣤⣤⣤⣤⣤⣀⣀⠄⠄⠄⠄⠄⠄⠄⠄
        ⠄⠄⠄⠄⠄⠄⢠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠄⠄⠄⠄
        ⠄⠄⠄⠄⠄⣰⣿⣿⡟⠻⣿⠟⠻⣿⣿⠛⢻⣿⡿⠻⣿⣿⣿⣦⡀⠄⠄
        ⠄⠄⠄⠄⣰⣿⡿⠋⠤⢤⡉⢰⡀⡈⢁⠄⠄⣙⡁⢀⡘⢿⢿⣿⣿⡄⠄
        ⠄⠄⠄⢠⣿⣿⠁⠄⠄⠄⢳⡀⢉⡀⣼⠄⠄⢨⠞⠉⠄⣀⡀⢿⣿⣿⠄
        ⠄⠄⣠⣼⣿⠇⠄⢀⡴⣒⢲⣷⠲⠇⠻⢧⣴⣿⢺⡙⣦⡌⠁⠄⣿⣿⣇
        ⠄⡞⠁⠄⡼⠄⠄⢹⡧⣉⠊⡟⠂⠄⠄⠄⠈⡇⣏⡷⣸⠁⠄⠄⢹⣿⢡
        ⠄⡇⠄⡀⠃⠄⠄⠄⠃⠩⠘⠂⢖⣛⠙⡦⠐⠛⠬⠕⠛⠃⠄⠄⠘⠃⢾
        ⠄⠳⣴⠃⠈⠚⠄⢠⠄⠄⠄⠄⠄⣹⣉⣀⣀⠄⠄⠄⡀⢢⣠⠄⠄⠄⡀
        ⠄⠄⡟⠄⠄⠄⠄⠘⢦⡤⠤⠖⠋⠉⠄⠄⠉⠉⠙⠲⡌⠃⠁⠄⠄⠄⣿
        ⠄⠄⡇⠄⠄⠄⢆⡄⢸⣇⣠⠖⠚⠩⠟⠉⠉⠙⠓⢢⡇⠄⠄⠄⠄⠄⣿
        ⠄⠄⡇⠄⠄⠄⠈⠄⠄⠙⢤⣤⠤⠖⠒⡒⠒⠒⠚⠁⠄⠐⡄⡀⠄⢀⡇
        ⠄⠄⢹⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠉⠁⠄⠄⠄⠄⠄⠄⠉⠠⢆⡞⠄
        ⠄⠄⠄⠱⣄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣠⠴⠋⠄⠄
        ⠄⠄⠄⠄⠈⠓⠒⠒⠒⠒⠒⠒⠛⠉⠉⠉⠉⠉⠉⠉⠉⠉⠄⠄⠄⠄
        `);
    },{})
];

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user)
        return;
    if (receivedMessage.content.startsWith('!'))
        processCommand(receivedMessage);
    // console.log(receivedMessage.content);
    // client.users.fetch('485685089485717507')
    //     .then((x) => {
    //         console.log(x);
    //     });
});

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(' ');
    let primaryCommand = splitCommand[0];
    let commandArguments = splitCommand.slice(1);
    let commandInstance = commandManager.find(x => x.commandString === primaryCommand);
    if (commandInstance) {
        commandInstance.action.call(null, receivedMessage, commandArguments, commandInstance.param);
        receivedMessage.react('❤️');
    }
}

function registerCommand(commandInstances) {
    if (commandInstances && !commandInstances.length)
        commandManager.push(commandInstances);
    if (commandInstances && commandInstances.length > 0)
        commandInstances.forEach(x => commandManager.push(x));
}

client.login(process.env.TOKEN);