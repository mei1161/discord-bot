import discord from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import axios from 'axios';

// 設定の読み込み
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const zoi_list = fs.readJsonSync('./data/zoi.json');

const env = process.env;
const appid = env.APPID;
const devid = env.DEVID;

const client = new discord.Client();

client.on('ready', async () => {
  console.log(`Botが起動しました。\nチャンネル数 : ${client.channels.size}\nユーザー数 : ${client.users.size}\nサーバー数 : ${client.guilds.size}`);
  client.user.setActivity(`現在 ${client.guilds.size} 個のサーバーに参加しています`);

});
client.on('guildMemberAdd',async member => {
  const channel = member.guild.channels.find(ch => ch.id === env.LOG_ID);
  if (!channel) return;
  channel.send(`まちこのおうちへようこそ！`+ member);
});

client.on('message', async message => {
  if (message.author.id == client.user.id){
    return;
  }
  const args = message.content.trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  if(command === "hello"){
    message.channel.send("hello");
  }

   if (command === 'embed') {
    let embed = new discord.RichEmbed();
    if (args[0] != undefined)
    {
      embed = embed.setTitle(args[0]);
    }
    else
    {
      embed = embed.setTitle('A slick little embed');
    }

    if (args[1] != undefined)
    {
      embed = embed.setDescription(args[1]);
    }
    else
    {
      embed = embed.setDescription(`Content`);
    }
   
    embed = embed.setColor(0xFF0000);
    message.channel.send(embed);
  }
  else if(command === '今日も１日'){
    const image = zoi_list[Math.floor(Math.random() * zoi_list.length)];
    const attachment = new discord.Attachment(image);
    message.channel.send(attachment);
  }
  if(command === 'address'){
    let zipcode;
    if(args[0] != undefined){
      zipcode = args[0];
      const url = `http://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;
      const res = await axios.get(url);
      const items = res.data;
      message.channel.send(`${items.results[0]['address1']}${items.results[0]['address2']}${items.results[0]['address3']}`);
    }
  }
  if(command === 'weather'){
    let cityname;
    if(args[0] != undefined){
      cityname = args[0];
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&APPID=${appid}`
      const res = await axios.get(url);
      const items = res.data;
      const ms1 = `天気:${items.weather[0].main}`;
      const ms2 = `平均気温:${(items.main.temp)}℃ `
      const ms3 = `湿度:${items.main.humidity}%`
      const ms4 = `体感温度:${items.main.feels_like}℃`
      message.channel.send(ms1+ms2+ms3+ms4);
    }
  }
  if(command === 'qiita'){
    let session;
    let day;
    let ms =" ";
    if(args[0] != undefined){
      session = args[0];
    }
    if(args[1] != undefined){
      day = args[1];
      const url = `https://us-central1-qiita-trend-web-scraping.cloudfunctions.net/qiitaScraiping/${session}/${day}`;
      const res = await axios.get(url);
      const items = res.data;
      for(let item in items.data){
        ms += `タイトル：${items.data[item].title} `;
        ms += `URL：${items.data[item].url} `;
      }
      message.channel.send(ms);
    }
  }
  if(command === "楽天"){
    let keyword;
    let ms;
    if(args[0] != undefined){
      keyword = args[0];
      let key_UTF8 = encodeURI(keyword);
      const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${devid}&keyword=${key_UTF8}&sort=standard`;
      const res = await axios.get(url);
      const items = res.data;
      for(let item of items.Items){
        ms += `${item.Item.itemUrl}  `;
      }
      message.channel.send(ms);
    }

  }

  
});

discord_bot();

async function discord_bot(){
  await client.login(env.DISCORD_TOKEN);
  const channel = client.channels.find(ch => ch.id === env.LOG_ID);
  await channel.send(`Botが起動しました`);
}

