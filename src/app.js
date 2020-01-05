import discord from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs-extra';

// 設定の読み込み
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const zoi_list = fs.readJsonSync('./data/zoi.json');


const env = process.env;

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
  }else if(message.content === "hello"){
    await message.channel.send("hello");
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
  }else if(command === '今日も１日'){
    const image = zoi_list[Math.floor(Math.random() * zoi_list.length)];
    const attachment = new discord.Attachment(image);
    message.channel.send(attachment);
  }

  
});

discord_bot();

async function discord_bot(){
  await client.login(env.DISCORD_TOKEN);
  const channel = client.channels.find(ch => ch.id === env.LOG_ID);
  await channel.send(`Botが起動しました`);
}

