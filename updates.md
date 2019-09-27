## DBCM Updates Logs
- Here are the dbcm update logs.

### DBCM v1.2.2
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


### DBCM v1.2.3
- Added to be able to put some message properties, for example message.author can be sent with %{message.author}
  * Example:

  - index.js
  ```js
  //...
  const dbcm = require("dbcm")
  const cm = new dbcm.bot(client, {
      lang: "en",
      runCommand: {
          cooldown: {
              time: 3000, //3 seconds
              msg: "%{message.author}, you're in cooldown to use the commands."
              /**
               * %{message.author} - mentions the author of msg
               * %{message.author.id} - The message author's user ID
               * %{message.guild.name} - The guild name
               * ${message.guild.id} - The id of guild
               * %{cmd.cooldown} - The cooldown of cmd in milliseconds. WARNING: That will appear in String type.
              */
          },
          blacklist: {
              list: ["User ID"],
              msg: "%{message.author}, you're on blacklist."
              /**
               * %{message.author} - mentions the author of msg
               * %{message.author.id} - The message author's user ID
               * %{message.guild.name} - The guild name
               * ${message.guild.id} - The id of guild
              */
          }
      }
  })
  ```