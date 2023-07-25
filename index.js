const { Client } = require('discord.js-selfbot-v13');
const gradient = require('./libs/gradient');
const colorsLib = require('./libs/colors');

const gradList = require('./assets/gradients')
const fs = require('fs')
const chalk = require('chalk')
const moment = require('moment')
const client = new Client({
  checkUpdate:false
});
let messageManager = {};
let selectedChannel = '';
let selectedChannelId = '';
let usernameKey = {}
let colors = {
  magenta:convertHexToASCII('#ff00ff'),
  red:convertHexToASCII('#FF0000'),
  yellow:convertHexToASCII('#FFBF00'),
  white:convertHexToASCII('#FFFFFF'),
  grey:convertHexToASCII('#bebebe'),
  green:convertHexToASCII('#00FF00'),
}

let GLOBAL_GRADIENT = gradList[require('./config/settings.json').gradient]
let line = GLOBAL_GRADIENT("===========================")

client.on('ready', async () => {
  console.log(`${colors.yellow}${client.user.username} is ready!${colors.white}`);
  await loadDms();
  loadServers();
  
  selectServer();
})

client.on('messageCreate', async (msg) =>{
  if(msg.guildId!=null) {
    let server = getServerFromId(msg.guildId);
    let channel = getChannelFromId(msg.channelId);
    if(selectedChannel==`${server.name}:#${channel.name}`) {
      logMessage(msg)
    }
  } else if(msg.channelId == selectedChannelId) {
    logMessage(msg);
  }
})

function loadServers() {
  let servers = JSON.parse(JSON.stringify(client.guilds.cache));
  for(let server of servers) {
    if(!messageManager[server.name]) messageManager[server.name] = {};
    let channels = JSON.parse(JSON.stringify(client.channels.cache)).filter((e)=>{
      return e.guildId == server.id;
    })
    
    for(let channel of channels) {
      if(channel.type!="GUILD_TEXT") continue;
      if(client.channels.cache.get(channel.id).viewable) {
        messageManager[server.name][channel.name] = ['']
      }
    }
  }
}

async function loadDms() {
  return new Promise(async(resolve, reject) => {
    let users = JSON.parse(JSON.stringify(client.users.cache)).sort((a,b)=>{
      let aName = a.globalName||a.username;
      let bName = b.globalName||b.username;
      
      if (aName < bName) return -1;
      else if (aName > bName) return 1;
      else return 0;
    });
    
    
    for(let user of users) {
      let name = user.globalName||user.username;
      let presence = await client.users.cache.get(user.id).presenceFetch();
      let status = "⚫"
      let bot = user.bot;
      if(presence?.status=='online') status='🟢';
      if(presence?.status=='dnd') status='🟡';
      if(presence?.status=='idle') status='🌙';
      let formattedName = `${status} ${name} ${bot?"🤖":""}`
      usernameKey[formattedName] = name;
      
      if(!messageManager['Direct Messages']) messageManager['Direct Messages'] = {}
      messageManager['Direct Messages'][formattedName] = ['test'];
    }
    resolve()
  })
}

async function directMessage(username) {
  let users = JSON.parse(JSON.stringify(client.users.cache)).filter((e)=>{
    let name = e.globalName||e.username;
    return name == usernameKey[username];
  });
  
  let personDmId = JSON.parse(JSON.stringify(client.channels.cache)).filter((e)=>{
    return e.recipient==users[0].id;
  })[0].id;
  
  let personDm = client.channels.cache.get(personDmId)
  
  const messages = await personDm.messages.fetch({limit:15})
  
  messages.reverse()
  for(const msg of messages) {
    let message = messages.get(msg[0]);
    logMessage(message)
  }
  selectedChannelId=personDm.id;
  selectedChannel='Direct Messages'
  promptMessageInput();
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function getServerFromId(id) {
  return client.guilds.cache.get(id);
}
function getChannelFromId(id) {
  return client.channels.cache.get(id);
}
client.login(process.env.id);

function selectServer() {
  clearConsole();
  messagesToDisplay = [];
  
  let servers = Object.keys(messageManager)
  let number = 0;
  let serverList = '';
  
  for(let server of servers) {
    number++;
    let color=number%2==0?colors.grey:colors.white;
    serverList+=`${color}${number}: ${server}${colors.white}\n`
  }
  readline.question(`${colors.yellow}Choose A Server:\n${line}${colors.white}\n${serverList}${line}\n${colors.white}`, index => {
    index = parseInt(index)-1;
    
    let srvId = '';
    for(let srv of JSON.parse(JSON.stringify(client.guilds.cache))) {
      if(srv.name==servers[index]) {
        srvId = srv.id;
      }
    }
    selectChannel(messageManager[servers[index]],servers[index],srvId,servers[index]=='Direct Messages')
  });
}

function selectChannel(server,name,srvId,dm) {
  messagesToDisplay = [];
  clearConsole();
  let channels = Object.keys(server)
  let number = 0;
  let channelList = '';
  
  for(let channel of channels) {
    number++;
    let color=colors.white;
    if(channel.includes("⚫")) color = colors.grey;
    if(channel.includes('Clyde')) {
      channelList+=`${colors.green}${number}: ${channel}${colors.white}\n`
    } else {
      channelList+=`${color}${number}: ${channel}${colors.white}\n`
    }
  }
  readline.question(`${colors.yellow}Choose A Channel:\n${line}${colors.white}\n${channelList}${line}\n${colors.white}`, index => {
    if(index=='exit') {
      selectedChannel=''
      selectedChannelId=''
      selectServer();
      return;
    }
    index = parseInt(index)-1;
    clearConsole();
    selectedChannel = `${name}:#${channels[index]}`;
    console.log(`Currently Selected: ${name} 🡆 #${channels[index]}\n`)
    if(!dm) {
        let guild = client.guilds.cache.get(srvId);
        for(let chn of JSON.parse(JSON.stringify(guild.channels.cache))) {
          if(chn.name==channels[index]){
            selectedChannelId = chn.id;
          }
        }
        let channel = client.channels.cache.get(selectedChannelId);
        
        let messagesSent = 0;
        logOldMessages(channel);
       
        promptMessageInput()
    } else {
      directMessage(channels[index])
    }
  });
}

let messagesToDisplay = [];
async function logMessage(message) {
  let member = {};
  try {
    member = await message.guild.members.fetch(message.author.id);
  } catch(e) {
    
  }
  // Oceanic's Code
  let msg = message;
  let name = member.nickname||msg.author.globalName||msg.author.username;
  
  if(member.displayHexColor) {
    name=convertHexToASCII(member.displayHexColor)+name;
  }
  let content = msg.content;
  if(msg.embeds>0) {
    content = msg.embeds[0].title
  }
  if(msg.interaction?.type=='APPLICATION_COMMAND') {
    let runner = msg.interaction.user.globalName;
    content=`${runner} ran /${msg.interaction.commandName}`
  }
  if(msg.attachments) {
    for(let attachment of JSON.parse(JSON.stringify(msg.attachments))) {
      if(attachment.contentType.includes('image')) {
        content+=`[${attachment.name}]`
      }
    }
  }

  if(content.includes('```')) {
    content = content.replace('```',colorsLib.hexBg("#bebebe"));
    content = content.replace('```',colorsLib.Reset);
  }
  const g = GLOBAL_GRADIENT
  let date = new Date(msg.createdTimestamp)
  let day = ('0' + date.getDate()).slice(-2)
  let month = ('0' + (date.getMonth() + 1)).slice(-2)
  let year = date.getFullYear()
  let min = ('0' + (date.getMinutes())).slice(-2)
  let sec = ('0' + (date.getSeconds())).slice(-2)
  let hr = ('0' + date.getHours()).slice(-2)-4;
  if(hr<0)hr = 24+hr;
  let blank = '';
  let c = '';
  let len = 0;
  if(!member.displayHexColor) {
    blank = `${month}-${day}-${year} | ${hr}:${min}:${sec} | ${name} |`
    c = g(`${month}%-%${day}%-%${year} %|% ${hr}%:%${min}%:%${sec} %|% ${name} %|%`)
  } else {
    blank = `${month}-${day}-${year} | ${hr}:${min}:${sec} | ${name} |`
    c = g(`${month}%-%${day}%-%${year} %|% ${hr}%:%${min}%:%${sec} %|% 🤦 %|%`)
    c = c.replaceAll("🤦",name)
  }
  len = blank.length-1
  // Add content
  blank += ` ${content}\n`
  c += ` ${content}`
  
  // Newline
  c = c.replaceAll('\n', `\n${' '.repeat(len)}${chalk.hex('#FFFFFF')('| ')}`);
  
  // messagesToDisplay.push(c)
  // if(messagesToDisplay.length>20) {
  //   messagesToDisplay.splice(0,1);
  // }
  // clearConsole();
  // console.log(messagesToDisplay.join('\n'))
  console.log(c)
}

async function logOldMessages(channel) {
  const messages = await channel.messages.fetch({limit:15})
  messages.reverse()
  for(const msg of messages) {
    let message = messages.get(msg[0]);
    logMessage(message)
  }
}

function promptMessageInput() {
  readline.question('', message => {
    if(message=='exit') {
      selectedChannel=''
      selectedChannelId=''
      selectServer();
      return;
    }
    if (message == 'list-gradients') {
      // for i, v
      for (name of Object.keys(gradList)) {
        let grad = gradList[name]
        const g = grad
        let date = new Date()
        let day = ('0' + date.getDate()).slice(-2)
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        let year = date.getFullYear()
        let min = ('0' + (date.getMinutes())).slice(-2)
        let sec = ('0' + (date.getSeconds())).slice(-2)
        let hr = ('0' + date.getHours()).slice(-2)
        let blank = `${month}-${day}-${year} | ${hr}:${min}:${sec} | Ozzy |`
        let c = g(`${month}%-%${day}%-%${year} %|% ${hr}%:%${min}%:%${sec} %|% Ozzy %|%`)
        let len = blank.length-1
        blank += ` ${name}\n`
        c += ` ${name}`
        console.log(c)
      }
      promptMessageInput();
      return
    }
    if (message.startsWith('set-gradient')) {
      let a = message.split(' ')[1]
      if (!a) {
        promptMessageInput()
        return console.log('Please specify a gradient!')
      }
      let name = 'pastel'
      if (!gradList[a]) {
        console.log('Invalid gradient, switching to pastel.')
        GLOBAL_GRADIENT = gradList.pastel
      } else {
        GLOBAL_GRADIENT = gradList[a]
        name = a
      }

      const temp = JSON.parse(fs.readFileSync('./config/settings.json'))
      temp.gradient = name
      fs.writeFileSync('./config/settings.json', JSON.stringify(temp))
      
      promptMessageInput();
      return
    }
    if(selectedChannelId) {
      if(message.length>0) {
        client.channels.cache.get(selectedChannelId).send(message.replaceAll('\\n', '\n'))
      }
    }
    promptMessageInput();
  })
}

function convertHexToASCII(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `\x1b[38;2;${r};${g};${b}m`
}

function clearConsole() {
    process.stdout.write('\u001b[3J\u001b[1J');
    console.clear();
}
