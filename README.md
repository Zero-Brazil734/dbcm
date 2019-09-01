<div><center><a href="https://nodei.co/npm/dbcm"><img src="https://nodei.co/npm-dl/dbcm.png"></a></div>

## Discord Bot Commands Manager
**Discord Bot Commands Manager**(이하 DBCM)은 명령어를 컬렉션에 저장하고 불러오기를 몇줄 만에 끝내 편리하게 해드리기 위해 만들어졌습니다.
라이브러리 특성상 *discord.js* 모듈 외에는 실행이 안 되니 사용시에 참고 부탁드립니다.


## DBCM Install
[참고]: discord.js v11.5 이상부터 호환됩니다.

`yarn add dbcm`
또는
`npm i dbcm --save`


### 사용법

- 명령어 저장법
  ```js
  const Discord = require("discord.js")
  const client = new Discord.Client()
  const dbcm = require("dbcm")
  const CmdManager = new dbcm.bot(client)

  CmdManger.registerCommands(`${__dirname}/commands/`, { createSample: true, jsFilter: true }) //명령어 등록
  /** 
   * 현재 CmdManger.registerCommands(`${__dirname}/commands/`)만 기입하면 오류가 나 기본 설정인 createSample와 jsFilter을 모두 
   * true로 두고 싶으시면 CmdManger.registerCommands(`${__dirname}/commands/`, {})라고 적어주세요.
  */
  ```

- 명령어 불러오기
  ```js
  client.on("message", async msg => {
      if(message.system || message.author.bot || message.channel.type === "dm" || !message.content.startsWith("프리픽스")) return

      const args = msg.content.slice("프리픽스".length).trim().split(/ +/g)
      const command = args.shift().toLowerCase()
      
      CmdManager.runCommand(command, msg, args)
  })
  ```