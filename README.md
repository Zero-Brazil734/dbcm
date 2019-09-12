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

  CmdManager.registerCommands(`${__dirname}/commands/`, { createSample: true, jsFilter: true }) //명령어 등록
  /** 
   * 위 코드를 CmdManager.registerCommands(`${__dirname}/commands/`)만 입력하신다면 위 두개의 설정들이 기본 설정인 true로 진행됩니다.
  */
  ```

- 명령어 불러오기
  ```js
  client.on("message", async msg => {
      if(message.system || message.author.bot || message.channel.type === "dm" || !message.content.startsWith("프리픽스")) return

      const args = msg.content.slice("프리픽스".length).trim().split(/ +/g) //프리픽스의 앞부분에서 글자수 만큼과 공백 제거 후, +를 제거하면서 Array화 
      const command = args.shift().toLowerCase() //args에서 제일 앞 문자열을 삭제 후 가져오면서 소문자화
      
      CmdManager.runCommand(command, msg, args, { cooldown: 3000, cdmsg: `${msg.author} 님은 현재 쿨타임 중입니다.` }) //명령어 로딩
      //쿨타임은 기본 설정이 비활성화입니다.
  
      if(msg.author.id === "개발자의 유저ID" && command === "쿨타임초기화") {
        CmdManager.resetCooldown(args[0])
        //"쿨타임초기화"의 바로 뒷부분으로 유저ID를 찾은 뒤 초기화(존재하지 않을시에 터미널에 오류 출력)
      }

      if(msg.author.id === "개발자의 유저ID" && command === "모든쿨초기화") {
        CmdManager.resetAllCooldown()
        //모든 쿨타임 초기화
      }
  })
  ```