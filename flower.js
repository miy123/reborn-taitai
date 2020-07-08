const Command = require('./model.js');
const Discord = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');

class Flower {
    constructor(type, color, price, maxPrice, branch, date, time) {
        this.type = type;
        this.color = color;
        this.price = price;
        this.maxPrice = maxPrice;
        this.branch = branch;
        this.date = date;
        this.time = time;
    }

    getName(property) {
        if (property === 'type')
            return '種類';
        if (property === 'color')
            return '顏色';
        if (property === 'price')
            return '價格';
        if (property === 'maxPrice')
            return '參考最高價';
        if (property === 'branch')
            return '分流';
        if (property === 'date')
            return '日期';
        if (property === 'time')
            return '時間';
    }
}

const FlowerModule = {
    async flowersDisplay(receivedMessage, commandArguments, param) {
        var doc = new GoogleSpreadsheet('15o7m9emcG2BlRqkUZlrvZL76nG8XBZixkDh9volMmug');
        doc.useApiKey(process.env.APIKEY);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows({ offset: 6, limit: 30 });
        var items = [];
        rows.forEach(x => {
            if (x['_rawData'][6])
                items.push(new Flower(x['_rawData'][0], x['_rawData'][1], x['_rawData'][2], x['_rawData'][3], x['_rawData'][4], x['_rawData'][5], x['_rawData'][6]));
        });
        var filterItem = items.filter(x => {
            var flags = false;
            commandArguments.forEach(y => {
                if (x.type.includes(y)) {
                    flags = true;
                }
            });
            return flags;
        });
        filterItem.forEach(x => {
            var keys = Object.keys(x);
            var fields = [];
            for (var i = 0; i < keys.length; i++) {
                fields.push({ name: x.getName(keys[i]), value: x[keys[i]] });
            }
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .addFields(fields)
                .setAuthor('created by 蒼冥賦流', 'https://truth.bahamut.com.tw/s01/201809/84d4cecc5e01510dbb62523629e4c769.JPG', '')
                .setTimestamp();
            receivedMessage.channel.send(exampleEmbed);
        });
    },

    getRegister() {
        return [
            new Command('花價', FlowerModule.flowersDisplay, null)
        ];
    }
};

module.exports = FlowerModule.getRegister;
