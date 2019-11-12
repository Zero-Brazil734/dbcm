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
               * %{cmd.cooldown} - The cooldown of cmd in seconds. WARNING: That will appear in String type.
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

### DBCM v1.2.4
- Fix some 'undefineds' errors and remove all try and catch because it was hiding the error location

### DBCM v1.2.5
- Apply asynchronouns function
  * Example:
   
  - index.js
  ```js
  //...
  cm.runCommand(cmd, msg, args).catch(err => console.error(err))
  ```

### DBCM v1.2.6
- Change the %{cmd.cooldown} from milliseconds to seconds

### DBCM v1.2.7
- Moved the class constructor to discord.js client
  * New Example: 
  ```js
  const dbcm = require("dbcm")
  const client = new dbcm.Client({
      lang: "en-US",
      disableEveryone: true,
      disabledEvents: ["TYPING_START"]
      autoReconnect: true,
      dev: "Dev ID" || ["Dev1", "Dev2"]
      ignoresCooldown: ["User1"],
      ignoreCooldownIfIsAdmin: true,
      blacklist: {
          list: ["User1"],
          msg: "something"
      },
      cooldown: {
          time: 3000,
          msg: "something"
      }
  })

  client.registerCommands(__dirname+"/commands/", { createSample: true, jsFilter: true }).catch(err => console.error(err))

  client.on("message", async message => {
      //message event options

      const args = msg.content.slice("<prefix>".length).trim().split(/ +/g)
      const cmd = args.shift().toLowerCase()

      client.runCommand(cmd, message, args)
  })
  ```

### DBCM v1.2.8
- Fixed multiple 'All cmds saved successfully.', sorry for inconvenience.

### DBCM v1.2.9
- Fixed many bugs, such as 'Unknown Language Error'. Now you can also set your language to 'lang'.

 ```js
 //...
 const client = new dbcm.Client({
     lang: "en-US",
     locale: "en-US"
 })
 ```

## DBCM v1.3.0
- The integration of mongoose(MongoDB). "Shortcuts" interacting with db will be released later
  
 ```js
 //...
 client.database.connect("", { useUnifiedTopology: true, useNewUrlParser: true }) //<-- Defaults
                       //^ This can be: mongodb://localhost/<your project>

 client.database.registerModels(__dirname + "/models") //mongoose models folder will be configured to be integrated within the client here

 //getting models
 client.database.models.get("yourmodel").findById("something", (err, res) => {
     if(err) throw new Error(err)
 })
 ```

## DBCM v1.3.1
- Shortcuts have been added and some useful methods have been added on the client.

```
WARNING: These are just a few simple shortcuts, 
and if you want to use your own update options, 
you'll need to deal directly with the model, 
such as <model>.findByIdAndUpdate(<query>, <value>, { upsert: true })
```

 ```js
 //...
 client.reloadCommand("eval").then(result => {
     if(result === true) console.log("Reloading was succeeded.")
 }).catch(err => { throw new Error(err) })

 client.reloadAllCommands()

 client.deleteCommand("eval")

 client.database.controller.setUpdate("<modelName>", { _id: "dbcm" }, { version: "1.3.1" }, { queryByID: false }) 
 //queryByID's default: false

 client.database.controller.pushUpdate("<modelName>", "dbcm", { controllers: "default" }, { queryByID: true })

 client.database.controller.watch("<modelName>", data => console.log(data))

 //Other new methods you may discover through IntelliSense
 ```