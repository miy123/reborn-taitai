const Command = require('./model.js');
const Discord = require('discord.js');

const MicModule = {
    micQuery: null,

    micQueue(receivedMessage, commandArguments, micQuery) {
        let query = micQuery.find(x => x.id == receivedMessage.channel.id);
        query.query.add(receivedMessage.author.toString());
        MicModule.micDisplay(receivedMessage, commandArguments, micQuery);
    },
    micDisplay(receivedMessage, commandArguments, micQuery) {
        let query = micQuery.find(x => x.id == receivedMessage.channel.id);
        let queryArray = [...query.query];
        let reponseMessage;
        if (queryArray.length == 0) {
            receivedMessage.channel.send('沒人鴨你各位還不趕緊排起來!!');
            return;
        }
        else if (queryArray.length > 0)
            reponseMessage = `
            麥上：${queryArray[0]}\n
            麥序：${queryArray.length == 1 ? '後面沒人鴨趕緊排起來!!' : queryArray.slice(1).reduce((x, y) => x + '➔' + y)}\n
            `;
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('無情的排麥機器🥺')
            // .setURL('https://discord.js.org/')
            // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('排麥打 !排麥 ，下麥記得打 !下麥')
            // .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: '規則', value: '每人唱1~2首歌，無人排麥可以繼續唱（求求' },
                // { name: '\u200B', value: '\u200B' }
            )
            .addField('狀態', reponseMessage)
            // .setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp();
        // .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
        receivedMessage.channel.send(exampleEmbed);
    },
    micLeave(receivedMessage, commandArguments, micQuery) {
        let query = micQuery.find(x => x.id == receivedMessage.channel.id);
        query.query.delete(receivedMessage.author.toString());
        MicModule.micDisplay(receivedMessage, commandArguments, micQuery);
    },
    micClear(receivedMessage, commandArguments, micQuery) {
        if (receivedMessage.author.id === '485685089485717507' || receivedMessage.member.permissions.has('ADMINISTRATOR *')) {
            let query = micQuery.find(x => x.id == receivedMessage.channel.id);
            query.query = new Set();
        }
        MicModule.micDisplay(receivedMessage, commandArguments, micQuery);
    },

    getRegister(listenChannels) {
        MicModule.micQuery = listenChannels.map(x => { return { id: x.id, name: x.name, group: x.group, query: new Set() } });
        console.log('start listen in');
        console.log(MicModule.micQuery);
        return [
            new Command('排麥', MicModule.micQueue, MicModule.micQuery),
            new Command('麥序', MicModule.micDisplay, MicModule.micQuery),
            new Command('下麥', MicModule.micLeave, MicModule.micQuery),
            new Command('清麥', MicModule.micClear, MicModule.micQuery)
        ];
    }
};

module.exports = MicModule.getRegister;
