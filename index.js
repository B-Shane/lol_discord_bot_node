const { Client, GatewayIntentBits } = require("discord.js");
const https = require('node:https');
const fetch = require('node-fetch');
//const fetch = import fetch from 'node-fetch';
const fs = require('fs'); 
const riotApiKey = process.env['RIOT_API_KEY'];

const client = new Client({
intents: [
    /*
        Intents 'GUILDS' is required
        if you wish to receive (message) events
        from guilds as well.

        If you don't want that, do not add it.
        Your bot will only receive events
        from Direct Messages only.
    */
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
   
],
partials: ['MESSAGE', 'CHANNEL'] // Needed to get messages from DM's as well
});


//When Logged into discord server
client.on("ready", () => {
console.log(`Logged in as ${client.user.tag}!`);
});

//When a message is created in discord
client.on("messageCreate", message => {

    console.log('message received: ' + message.content);
    if (message.content === "ping") {!
        message.reply("pong");
    }

    if(message.content.indexOf("!lol")!=-1){
      const lol = message.content.substring(4,message.content.length);
      console.log(lol);
      https.get('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + lol + '?api_key='+riotApiKey, (resp) => {

        resp.on('data', (d) => {
         
          let acctPuId = JSON.parse(d).puuid;
          console.log("acctPuId: " + acctPuId);
          getLatestMatch(acctPuId);
        });

      
      });
    }
});
const discordKey = process.env['DISCORD_KEY'];
client.login(discordKey);

function getLatestMatch(puId){

  //console.log(puId);
    https.get('https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/'+puId+ '/ids?start=0&count=20&api_key='+riotApiKey, (res) => {
        console.log('statusCode:', res.statusCode);
        
        
      
        res.on('data', (d) => {
          console.log("TotalMatchIds: " + d);
          const data = JSON.parse(d);        
          getMatch(data[0],puId);
        });
         
});
}
async function getMatch(matchId,puId){

  /*
  https.get('https://americas.api.riotgames.com/lol/match/v5/matches/'+matchId+'?api_key='+riotApiKey, (resp) => {
  
        resp.on('data', (d) => {        
          
          
          //let matchResults = d.json();
          console.log("test: " + d.info.gameDuration);
       
        });        
    });
  */
  
  let response = await fetch('https://americas.api.riotgames.com/lol/match/v5/matches/'+matchId+'?api_key='+riotApiKey);
  response = await response.json();
  //console.log("response: " + JSON.stringify(response));
  console.log("test: " + JSON.stringify(response.info));
  
}
