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
  const CmdManager = new dbcm.bot(client, { lang: "kr" }) //default: kr(korean)
  //Supported languages: kr(korean), en(english) and pt(portuguese-brazil)

  CmdManager.registerCommands(`${__dirname}/commands/`, { createSample: true, jsFilter: true }) //명령어 등록 : Registering the cmds : Registrando os cmds
  /** 
   * 위 코드를 CmdManager.registerCommands(`${__dirname}/commands/`)만 입력하신다면 위 두개의 설정들이 기본 설정인 true로 진행됩니다.
   * If you type only CmdManager.registerCommands(`${__dirname}/commands`), the two settings above will remain true which is the * default
   * Se digitar somente CmdManager.registerCommands(`${__dirname}/commands`), as duas configurações acima continuarão como true que * é a padrão.
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
       * Deleta a parte de frente pela quantidade de letras no prefixo, apaga os espaços em branco e transforma o em Array * removendo a '+' se tiver.
      */
      const command = args.shift().toLowerCase() 
      /** 
       * 'args'에서 제일 앞 문자열을 삭제 후 가져오면서 소문자화
       * Delete the first String from 'args' and transform it to lowercase
       * Deleta a primeira String de 'args' e transforma em letra minúscula
      */
      
      CmdManager.runCommand(command, msg, args, { cooldown: 3000, cdmsg: `${msg.author} 님은 현재 쿨타임 중입니다.` }) //명령어 로딩 : Loading the commands : Carregando os comandos
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