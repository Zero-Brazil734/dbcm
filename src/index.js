#!/dbcm/src/env node

const { Collection } = require("discord.js")
const fs = require("fs")
const chalk = require("chalk")


class CommandsRegister {
    constructor(client) {
        this.client = client
        this.client.aliases = new Collection()
        this.client.commands = new Collection()
    }

    /**
     * @param {String} command - 메세지 이벤트의 명령어(예시: const command = args.shift().toLowerCase())
     * @param {Object} msg - 메세지 이벤트
     * @param {String[]} args - 메세지 이벤트의 메세지 내용이 Array로 정리된것(예시: const args = message.content.slice("프리픽스".length).trim().split(/ +/g))
     */
    runCommand(command, msg, args) {
        if(typeof command !== "string") throw new TypeError(chalk.default.magenta("DBCM Error: 명령어를 실행하려면 commands가 String(문자열) 형식이여야 합니다.\n")+chalk.default.gray("예시:\nhttps://github.com/Zero-Brazil734/dbcm"))
        if(typeof msg !== "object") throw new TypeError(chalk.default.magenta("DBCM Error: message는 Object 형식이여야 합니다.\n"+chalk.default.gray("예시:\nhttps://github.com/Zero-Brazil734/dbcm")))
        if(!Array.isArray(args)) throw new TypeError(chalk.default.magenta("DBCM Error: args는 Array 형식이여야 합니다.\n"+chalk.default.gray("예시:\nhttps://github.com/Zero-Brazil734/dbcm")))

        if(this.client.commands.get(command)) {
            try{
                this.client.commands.get(command).run(this.client, msg, args)
            }catch(err){
                throw new Error(err)
            }
        }
        if(this.client.aliases.get(command)) {
            try{
                this.client.aliases.get(command).run(this.client, msg, args)
            }catch(err){
                throw new Error(err)
            }
        }
    }

    /**
     * @param {string} dir - 명령어 폴더의 디렉터리(예시: __dirname+"/commands")
     * @param {boolean} options.jsFilter - 자바스크립트 파일만 저장
     * @param {boolean} options.createSample - 명령어 파일이 없을시 샘플 파일 생성
     */
    registerCommands(dir, options = { createSample: true, jsFilter: true }) {
        if(typeof dir !== "string") {
            throw new TypeError("DBCM Error: 명령어의 디렉터리는 스트링(문자열)이여야 합니다.\n"+chalk.default.gray("예시:\nhttps://github.com/Zero-Brazil734/dbcm"))
        }
        if(options.createSample !== undefined && options.createSample !== null && typeof options.createSample !== "boolean" && typeof options.createSample == "undefined") {
            throw new TypeError(chalk.default.gray("DBCM Error: createSample은 Boolean(true/false)이여야 합니다.\n"+"예시:\nhttps://github.com/Zero-Brazil734/dbcm"))
        }
        if(options.jsFilter !== undefined && options.jsFilter !== null && typeof options.jsFilter !== "boolean" && typeof options.jsFilter == "undefined") {
            throw new TypeError(chalk.default.gray("DBCM Error: jsFiltering은 Boolean(true/false)이여야 합니다.\n예시:\nhttps://github.com/Zero-Brazil734/dbcm"))
        } 
        fs.readdir(dir, async(err, files) => {
            if(err) {
                let mkstr = err.message.toString()
                if(mkstr.includes("ENOENT: no such file or directory, scandir")) {
                    await fs.mkdirSync(dir); 
                    await console.log(chalk.default.yellow("[DBCM] commands 파일을 생성합니다."));
                    process.exit()
                }else{
                    throw new Error(err)
                }
            }

            if(options.jsFilter === true) {
                var filteredFiles = files.filter(f => f.split(".").pop() === "js")
            }else{
                var filteredFiles = files
            }

            if(filteredFiles.length <= 0) {
                if(options.createSample === true) {
                    let writing = await fs.createWriteStream(`${dir}/ping.js`, { encoding: "utf-8" })
                    await fs.writeFileSync(`${dir}/ping.js`, "exports.run = (client, message, args) => {\n    message.reply(\"Pong!\")\n}\nexports.config = {\n    name: \"ping\",\n    aliases: [\"pong\", \"pn\", \"핑\", \"퐁\"]\n}")
                    writing.end()
                    await console.log(chalk.default.red("[DBCM] 명령어 파일이 존재하지 않는것으로 확인되어 샘플 파일을 생성합니다."))
                    process.exit()
                }else{
                    throw new ReferenceError("DBCM Error: 해당 디렉터리에는 파일이 존재하지 않습니다.")
                }
            }

            await filteredFiles.forEach(name => {
                let cmd = require(`${dir}/${name}`)
                if(cmd.config == undefined && cmd.config == null && typeof cmd.config !== "object") {
                    console.error(chalk.default.magenta(`[DBCM] 해당 ${name} 파일에는 명령어의 설정란이 존재하지 않습니다. TIP: 만약 exports.help 설정란을 사용하신다면 exports.config로 바꿔주세요.`))
                    process.exit()
                }
                if(cmd.config.name == undefined || cmd.config.aliases == null && cmd.config.name == null || cmd.config.aliases == undefined && typeof cmd.config == "object") {
                    console.error(chalk.default.magenta(`[DBCM] 해당 ${name} 파일에는 명령어의 설정란에서 name 또는 aliases 설정이 존재하지 않습니다.`))
                    process.exit()
                }
                if(typeof cmd.config.name !== "string") {
                    console.error(chalk.default.magenta(`[DBCM] 해당 ${name} 파일의 설정란 중 name 항목은 String(문자열)이여야 합니다.`))
                    process.exit()
                }
                if(!Array.isArray(cmd.config.aliases) && typeof cmd.config.aliases !== "string") {
                    console.error(chalk.default.magenta(`[DBCM] 해당 ${name} 파일의 설정란 중 aliases 항목은 Array 또는 String(문자열) 형식이여야 합니다.`))
                    process.exit()
                }
                this.client.commands.set(cmd.config.name, cmd)
                console.log(chalk.default.green(`[DBCM] ${name} 파일의 명령어 저장 완료`))
                for(var alias of cmd.config.aliases) {
                    this.client.aliases.set(alias, cmd)
                    console.log(chalk.default.green(`[DBCM] ${name} 파일의 단축키 저장 완료`))
                }
            })

            console.log(chalk.default.cyan("[DBCM] 모든 명령어 로딩 완료"))
        })
    }
}


module.exports.bot = CommandsRegister