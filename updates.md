## DBCM Updates Logs
- Here are the dbcm update logs.

# DBCM v1.2.2
- Changed configuration from 'runCommand' to bot class constructor, and added blacklist of bot's cmd
  * New Example: 

  - index.js(or bot.js and others)
  ```js
  const { Client } = require("discord.js")
  const client = new Client()
  const dbcm = require("dbcm")
  const CmdManager = new dbcm.bot(client, {
      lang: "en",
      runCommand: {
          cooldown: {
              msg: "The cooldown msg will be stay here",
              time: 3000 //Cooldown seconds/minutes will be stay here
          },

          blacklist: {
              list: ["UserID"], //Blacklisted users ID will be stay here
              msg: "The msg that will appear when a blacklisted user uses the command will be here."
          }
      }
  })


  //registerCommands

  client.on("message", async msg => {
      //message event settings
      const args = msg.content.slice("<prefix>".length).trim().split(/ +/g)
      const cmd = args.shift().toLowerCase()

      CmdManager.runCommand(cmd, msg, args, { 
          //handling options example
          dbuser: "Anonymous",
          dbpassword: "abcd1234",
          dbhost: "localhost"
      })
  })
  ```
  
  - ping.js(example) 
  ```js
  exports.run = (client, message, args, test) => {
    message.reply("Pong! " + test.dbuser + ", " + test.dbhost + ", " + test.dbpassword)
  }

  exports.config = {
    name: "ping",
    aliases: ["pong", "pn", "핑", "퐁"]
  }
  ```