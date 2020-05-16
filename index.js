require('dotenv').config();
const Discord = require('discord.js');
const Command = require('./model.js');
const MicModuleRegister = require('./mic.js');
const client = new Discord.Client();

const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-type': 'text/plain'
    });
    res.write('Hey');
    res.end();
}).listen(4000);

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

client.on('ready', () => {
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
    // client.channels.fetch('649259219895320626').then((x) => {
    //     x.send('hello');
    // });
    // 不九居
    // 人間客 - category - 557438776805294087
    // 落拓 - voice - 557438776805294088
    // 迎風 - text - 557439925151072296
    // 問心 - text - 557440161231667200
    // 望故 - text - 557440198670024704
    // 道藏 - voice - 557443911120060418
    // 不問 - voice - 612192820513734677
    // 太上 - text - 649259219895320626
    // 天機 - text - 649862300270067723

    // 社恐患者的茶話會
    // 文字频道 - category - 431383784210956290
    // 秘密會議 - text - 431383784210956291
    // 语音频道 - category - 431383784210956292
    // ◆ － － 劍俠世界  － － ◇-voice - 431383784210956293
    // 《東方 - 交易行》-voice - 687532075875565588
    // 《殤凉 - 浩氣活點》-voice - 687532459294064660
    // 《染夢 - 試劍台》-voice - 689707168907395089
    // 公開宣告 - text - 689875389366927377
    // 《糖糖 - 青竹書院》-voice - 690198899440353375
    // 《聚集之地 - 成都》-voice - 690271124331823155
    // 《阿月 - 與世隔絕》-voice - 690281794167242772
    // 《奶茶 - 茶館》-voice - 690284534570156110
    // 《阿禿 - 寺廟》-voice - 690284630833758416
    // ◆ － － 落地成盒 － － ◇-voice - 691326173002858496
    // 《奪命ZOOM》-voice - 694040911230795826
    // ◆ － － 現實世界  － － ◇-voice - 694041193922822155
    // 《冚家拎Deadline日》-voice - 694048716830670969
    // 《你好世界》-text - 694054188065488926
    // 《奪命Teams》-voice - 694054771447038022
    // 《至軒 - 純陽》-voice - 697453454200799242
    // 《曲玲 - 大奶媽之地》-voice - 697483519781240912
    // 《你好再見 - 京師》-voice - 698197968104325192
    // 《一幽 - 花海》-voice - 698432069352554597
    // 《死亡單中》-voice - 701344422356582421
    // 《自閉盲選》-voice - 701344490350313483
    // ◆ － － 英雄聯盟  － － ◇-voice - 701344758043377674
    // 《快樂死鬥》-voice - 701344912578183208
});

// '431383374586707978' => GuildMember {
//     guild: [Guild],
//         user: [User],
//             joinedTimestamp: 1522920308918,
//                 lastMessageID: null,
//                     lastMessageChannelID: null,
//                         premiumSinceTimestamp: null,
//                             deleted: false,
//                                 _roles: [Array],
//                                     nickname: 'Dominate - 白痴公主殤'
// },
// '347367515065942017' => GuildMember {
//     guild: [Guild],
//         user: [User],
//             joinedTimestamp: 1525083942257,
//                 lastMessageID: null,
//                     lastMessageChannelID: null,
//                         premiumSinceTimestamp: null,
//                             deleted: false,
//                                 _roles: [Array],
//                                     nickname: 'Pride - 茶杯楊東'
// },

const commandManager = [
    new Command('help', (receivedMessage, commandArguments, param) => {
        receivedMessage.channel.send(
            `base command list\n
            !hello   --say hello to you
            !roll    --get random number
            !劍純行為 --emm you know that
            `);
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
    }, {})
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
    commandInstance.action.call(null, receivedMessage, commandArguments, commandInstance.param);
    receivedMessage.react('❤️');
}

function registerCommand(commandInstances) {
    if (commandInstances && !commandInstances.length)
        commandManager.push(commandInstances);
    if (commandInstances && commandInstances.length > 1)
        commandInstances.forEach(x => commandManager.push(x));
}

client.login(process.env.TOKEN);