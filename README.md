![MIT](https://img.shields.io/dub/l/vibe-d.svg)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/dbcm)
[![NPM version](https://badge.fury.io/js/dbcm.svg)](https://www.npmjs.com/package/dbcm)

<div><center><a href="https://nodei.co/npm/dbcm"><img src="https://nodei.co/npm-dl/dbcm.png"></a></div>


## Discord Bot Commands Manager
**Discord Bot Commands Manager**(이하 DBCM)은 명령어를 컬렉션에 저장하고 불러오기를 몇줄 만에 끝내 편리하게 해드리기 위해 만들어졌습니다.
라이브러리 특성상 *discord.js* 모듈 외에는 실행이 안 되니 사용시에 참고 부탁드립니다.

**Discord Bot Commands Manager**(DBCM) was created to make it easy to store and load commands in a Collection in just a few lines. Due to the nature of the library, it is only compatible with [Discord](https://discordapp.com) bots using *discord.js*

O **Discord Bot Commands Manager**(DBCM) foi criado para facilitar o armazenamento e o carregamento de comandos em uma Collection em apenas algumas linhas. Devido à natureza da biblioteca, é somente compatível com bot de [Discord](https://discordapp.com) que usam *discord.js*

## DBCM Install
[참고]: discord.js v11.5 이상부터 호환됩니다.

[Observation]: Compatible since discord.js v11.5 and above.

[OBS]: Somente compatível com discord.js acima de v11.5 ou mais.

```yarn add dbcm```
또는(or : ou)
```npm i dbcm --save```


### 사용법 : Usage : Como usar

- 명령어 저장법 : Saving cmds : Salvando os cmds
  ```js
  const Discord = require("discord.js")
  const client = new Discord.Client()
  const dbcm = require("dbcm")
  const CmdManager = new dbcm.bot(client, { 
    lang: "kr",  //default: en(english),
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
  //Supported languages: kr(korean), en(english) and pt(portuguese-brazil)

  CmdManager.registerCommands(`${__dirname}/commands/`, { createSample: true, jsFilter: true }) //명령어 등록 : Registering the cmds : Registrando os cmds
  /** 
   * 위 코드를 CmdManager.registerCommands(`${__dirname}/commands/`)만 입력하신다면 위 두개의 설정들이 기본 설정인 true로 진행됩니다.
   * If you type only CmdManager.registerCommands(`${__dirname}/commands`), the two settings above will remain true which is the default.
   * Se digitar somente CmdManager.registerCommands(`${__dirname}/commands`), as duas configurações acima continuarão como true que é a padrão.
  */
  ```

- 명령어 불러오기 : Running the cmds : Executando os cmds
  ```js
  client.on("message", async msg => {
      if(message.system || message.author.bot || message.channel.type === "dm" || !message.content.startsWith("프리픽스(prefix)")) return

      const args = msg.content.slice("프리픽스(prefix)".length).trim().split(/ +/g) 
      /**
       * 프리픽스의 앞부분에서 글자수 만큼과 공백 제거 후, +를 제거하면서 Array화 
       * Deletes the front by the number of letters in the prefix, removes the whitespace and transforms it to Array by removing the '+' if it has one.
       * Deleta a parte de frente pela quantidade de letras no prefixo, apaga os espaços em branco e transforma o em Array removendo a '+' se tiver.
      */
      const command = args.shift().toLowerCase() 
      /** 
       * 'args'에서 제일 앞 문자열을 삭제 후 가져오면서 소문자화
       * Delete the first String from 'args' and transform it to lowercase
       * Deleta a primeira String de 'args' e transforma em letra minúscula
      */
      
      
      CmdManager.runCommand(command, msg, args, { dbpassword: "asdf1234", dbuser: "Anonymous" }) //명령어 로딩 : Loading the commands : Carregando os comandos
      //쿨타임은 기본 설정이 비활성화입니다. : The default is cooldown disabled : O padrão é cooldown desativado
  
      //아래의 두 명령어는 ~~귀찮아서~~ index 형식으로 써두었습니다. : I wrote these two commands in index form because I was too lazy to explain how to handler : eu escrevi esses dois comandos em forma de index porque fiquei com preguiça de explicar como handler
      if(msg.author.id === "개발자의 유저ID(Dev UserID)" && command === "쿨타임초기화") {
        CmdManager.resetCooldown(args[0])
        /**
         * '쿨타임초기화'의 바로 뒷부분의 문자열로 유저ID를 찾은 뒤 초기화(존재하지 않을시에 터미널에 오류 출력)
         * Searches and resets with user with id behind '쿨타임초기화' and if not exists emits the error
         * Procura e reseta com o usuário com o ID atrás do '쿨타임초기화' e se não existir emite o erro
        */
      }

      if(msg.author.id === "개발자의 유저ID" && command === "모든쿨초기화") {
        CmdManager.resetAllCooldown()
        /**
         * 모든 쿨타임 초기화
         * Resets cooldowns for everyone
         * Reseta os cooldowns de todos os usuários
        */
      }
  })
  ```

  - 유틸리티 : Utility : Utilidades 
  ```js
  const utils = new dbcm.utils({ lang: "kr" }) //default: English

  client.on("message", async msg => {
    //... (message config)
    if(command === "reverse") { //만약 메세지가 'reverse'로 시작한다면 : if message starts with 'reverse' : Se a mensagem começar com 'reverse'
      msg.channel.send(utils.reverse(msg.content)) //그 메세지의 내용을 반대로 돌려 해당 채널에 전송 : Sending message with the message reversed of what you sent. : Enviara a mensagem com a mensagem revertida do que você mandou.
      /**
       * > utils.reverse("test")
       * > tset
      */
    }

    if(command === "discordStatus" && msg.author.id === "Dev ID") { 
      utils.discordStatus("summary" || "status" || "unresolved_incidents" || "all_incidents" || "upcoming_maintenances" || "active_maintenances" || "all_maintenances", data => { //검색된 데이터를 callback로 처리 : callback of the datas found : callback de dados encontrados
        console.log(data) 
        /**
         * 그 데이터를 object 형식으로 출력합니다.
         * Show this data in object form
         * Mostra esses dados em forma de objeto.
        */
      })
    }

    if(command === "numberFilter") {
      msg.reply(utils.numberFilter(args.join(" "), { toNumber: false }) //toNumber's default: false
      /**
       * 명령어를 제외한 메세지의 내용에서 숫자만 추출한뒤 돌려줍니다.
       * Filter only the numbers in the message content and return it
       * Filtra só os números no conteúdo da mensagem e devolve-a 
      */
    }
  })
  ```