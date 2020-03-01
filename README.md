<center>
<h1>⚠️WARNING️ This package is now deprecated.</h1> 
</center>

<h1 align="center">Discord Bot Commands Manager🤖</h1>
<p>
  <a href="https://www.npmjs.com/package/dbcm" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/dbcm.svg">
  </a>
  <a href="https://github.com/Zero-Brazil734/dbcm/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-no-red.svg" />
  </a>
  <a href="https://github.com/Zero-Brazil734/dbcm/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/Zero-Brazil734/dbcm" />
  </a>
  <a href="https://npmcharts.com/compare/dbcm?minimal=true" target="_blank">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/dbcm.svg">
  </a>
</p>
<div><center><a href="https://nodei.co/npm/dbcm"><img src="https://nodei.co/npm-dl/dbcm.png"></a></div>

> Discord Bot Commands Manager(dbcm) is project to support discord bot command control in a few lines.

## Install

- NPM:
```sh
npm install dbcm --save
```

- Yarn
```sh
yarn add dbcm
```

## Usage

```js
const Discord = require("discord.js")
const dbcm = require("dbcm")
const client = new dbcm.Client({
    dev: "Dev ID" || ["Dev ID", "Dev ID"], //That will ignore cooldown and blacklist.
    lang: "en-US", //This also can be setted by locale. (default: english) Supported languages: kr(korean), en(english) and pt(portuguese-brazil)
    disableEveryone: true, //discord.js client options are also valid.
    ignoresCooldown: ["User1", "User2"], //Specifying users to ignore cooldowns
    ignoreCooldownIfIsAdmin: true, //This will cause them to ignore cooldowns if they have admin permission
    cooldown: {
        time: 3000, //3 seconds
        msg: "%{message.author}, you're in cooldown to use the commands."
        /**
          * %{message.author} - mentions the author of msg
          * %{message.author.id} - The message author's user ID
          * %{message.guild.name} - The guild name
          * %{message.guild.id} - The id of guild
          * %{cmd.cooldown} - The cooldown of cmd in seconds. WARNING: That will appear in String type. Please use client.cooltime to get in Number type
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
})


//Registering the commands
client.registerCommands(require.resolve("./commands"), { createSample: true, jsFilter: true }) 
/*
If you type only client.registerCommands(require.resolve("./commands")), 
the two settings above will remain true which is the default.
*/


//Running the commands
client.on("message", async message => {
    //... your if(...) return options

    const args = message.content.slice("PREFIX".length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    /*
    Some ways to get the command, such as message.content.split(" ") and a 
    few more lines, may not work because the command itself is contained in 
    the array. To solve this problem if even trying const command = <MessageArray>.shift() 
    doesn't work out, throw in the issues(https://github.com/Zero-Brazil734/dbcm/issues) 
    that check what the problem is.
    */

    //Running
    client.runCommand(command, msg, args, { dbpassword: "asdf1234", dbuser: "Anonymous" }) 
    /*
    Your own handling data, you can get it by placing it 
    in the object after args. (And of course you will need 
    to change the original exports.run to 
    exports.run = (client, message, args, yourdata) => { <CommandCode> })
    */
        .then(runned => {
            if(runned === true) return //do something
        })
        .catch(err => {
            throw new Error(err)
        })
    //The default is cooldown disabled

    //Utilities
    if(command === "discordStatus") { 
        utils.discordStatus("summary" || "status" || "unresolved_incidents" || "all_incidents" || "upcoming_maintenances" || "active_maintenances" || "all_maintenances", data => { //callback of the datas found
            console.log(data) 
        //Show this data in object form
        })
    }

    if(command === "reverse") { 
        msg.channel.send(utils.reverse(msg.content)) //Sending message with the message reversed of what you sent.
        /**
         * > utils.reverse("test")
         * > tset
        */
    }

    if(command === "numberFilter") {
        msg.reply(utils.numberFilter(args.join(" "), { toNumber: false }) //toNumber's default: false
        //Filter only the numbers in the message content and return it
    }

    //Other methods you may discover through IntelliSense
})
```

## Example

Please visit [dbcm-example](https://github.com/Zero-Brazil734/dbcm-example)

## Author

👤 **제로ㅣBrazil**

* Github: [@Zero-Brazil734](https://github.com/Zero-Brazil734)
* Discord: 제로ㅣBrazil#5005
* Email: zero734kr@gmail.com

## 🤝 Contributing

Contributions, issues and feature requests are **very** welcome!<br />Feel free to check [issues page](https://github.com/Zero-Brazil734/dbcm/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [제로ㅣBrazil](https://github.com/Zero-Brazil734).<br />
This project is [MIT](https://github.com/Zero-Brazil734/dbcm/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
