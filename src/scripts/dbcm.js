const { Collection } = require("discord.js")
const fs = require("fs")
const chalk = require("chalk")
const cooldownManager = new Set()

class CmdManager {
    constructor(client, options = { lang: "kr" }) {
        this.client = client
        this.client.aliases = new Collection()
        this.client.commands = new Collection()
        this.locale = options.lang

        if(this.locale === "kr") {
            this.pkg = require("../locales/kr.json")
        }else if(this.locale === "pt") {
            this.pkg = require("../locales/pt.json")
        }else if(this.locale === "en") {
            this.pkg = require("../locales/en.json")
        }
    }

    /**
     * @param {string} command - 메세지 이벤트의 명령어(예시: const command = args.shift().toLowerCase())
     * @param {object} msg - 메세지 이벤트
     * @param {string[]} args - 메세지 이벤트의 메세지 내용이 Array로 정리된것(예시: const args = message.content.slice("프리픽스".length).trim().split(/ +/g))
     * @param {object} options - 명령어의 커스텀 설정
     * @param {number} options.cooldown - 명령어의 쿨타임 설정
     * @param {string} options.cdmsg - 명령어의 쿨타임 메세지 설정
     */
    runCommand(command, msg, args, options = { cooldown: 0, cdmsg: "undefined" }) {
        if (typeof command !== "string") throw new TypeError(chalk.default.magenta(this.pkg.notastring.replace("{}", "command")) + chalk.default.gray(`${this.pkg.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        if (typeof msg !== "object") throw new TypeError(chalk.default.magenta(this.pkg.notaobject.replace("{}", "message") + chalk.default.gray(`${this.pkg.example}:\nhttps://github.com/Zero-Brazil734/dbcm`)))
        if (!Array.isArray(args)) throw new TypeError(chalk.default.magenta(this.pkg.notaarray.replace("{}", "args") + chalk.default.gray(`${this.pkg.example}:\nhttps://github.com/Zero-Brazil734/dbcm`)))
        if (options.cooldown !== undefined && options.cooldown !== null && typeof options.cooldown !== "number" && options.cooldown >= 0 && options.cooldown < 3000) throw new RangeError(chalk.default.magenta(this.pkg.minimumis3))
        if (options.cooldown !== undefined && options.cooldown !== null && typeof options.cooldown !== "number" && options.cooldown > 60000 * 5) throw new RangeError(chalk.default.magenta(this.pkg.maximumis5))
        if (options !== undefined && options.cooldown !== undefined && options.cdmsg === "undefined" && options.cooldown >= 3000 && options.cdmsg !== undefined && options.cdmsg === "") throw new SyntaxError(chalk.default.magenta(this.pkg.cdmsg))

        /**
         * @param {number} this.cmdsCooldown - 명령어의 쿨타임 확인
         */
        this.cmdsCooldown = options.cooldown
        /**
         * @param {string} this.cooldownMsg - 해당 유저가 쿨타임 중일때 출력하는 메세지 확인
         */
        this.cooldownMsg = options.cdmsg

        if (this.client.commands.get(command)) {
            try {
                if (cooldownManager.has(msg.author.id) && options.cdmsg !== "undefined") {
                    return options.cdmsg !== "undefined" && options.cdmsg !== undefined && options.cdmsg !== "" ? msg.channel.send(options.cdmsg) : undefined
                }
                this.client.commands.get(command).run(this.client, msg, args)
                if (options.cooldown >= 3000) cooldownManager.add(msg.author.id)
                setTimeout(() => {
                    cooldownManager.delete(msg.author.id)
                }, options.cooldown)
            } catch (err) {
                throw new Error(err)
            }
        }
        if (this.client.aliases.get(command)) {
            try {
                if (cooldownManager.has(msg.author.id)) {
                    return msg.channel.send(options.cdmsg)
                }
                this.client.aliases.get(command).run(this.client, msg, args)
                cooldownManager.add(msg.author.id)
                setTimeout(() => {
                    cooldownManager.delete(msg.author.id)
                }, options.cooldown)
            } catch (err) {
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
        if (!["kr", "en", "pt"].includes(this.locale)) {
            console.error(chalk.default.magenta(`Unknown language. Supported langs: kr, en, pt`))
            process.exit()
        }
        if (typeof dir !== "string") {
            throw new TypeError(this.pkg.notastring2 + chalk.default.gray(`${this.pkg.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }
        function isError(asdf) {
            asdf !== undefined && asdf !== null && typeof asdf !== "boolean" && typeof asdf == "undefined"
        }
        if (isError(options.createSample)) {
            throw new TypeError(chalk.default.gray(this.pkg.notaboolean.replace("{}", "createSample") + `${this.pkg.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }
        if (isError(options.jsFilter)) {
            throw new TypeError(chalk.default.gray(this.pkg.notaboolean.replace("{}", "jsFilter") + `${this.pkg.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }

        /**
         * @param {object} this.registerOptions - 명령어 저장의 설정 확인
         */
        this.registerOptions = options
        /**
         * @param {string} this.cmdsDir - 명령어를 저장할때 읽는 폴더 확인
         */
        this.cmdsDir = dir

        fs.readdir(dir, async (err, files) => {
            if (err) {
                let mkstr = err.message.toString()
                if (mkstr.includes("ENOENT: no such file or directory, scandir")) {
                    fs.mkdirSync(dir)
                    console.log(chalk.default.yellow(this.pkg.createdir.replace("{}", "commands")));
                    process.exit()
                } else {
                    throw new Error(err)
                }
            }

            if (options.jsFilter === true) {
                var filteredFiles = files.filter(f => f.split(".").pop() === "js")
            } else {
                var filteredFiles = files
            }

            if (filteredFiles.length <= 0) {
                if (options.createSample === true) {
                    let writing = await fs.createWriteStream(`${dir}/ping.js`, { encoding: "utf-8" })
                    await fs.writeFileSync(`${dir}/ping.js`, "exports.run = (client, message, args) => {\n    message.reply(\"Pong!\")\n}\nexports.config = {\n    name: \"ping\",\n    aliases: [\"pong\", \"pn\", \"핑\", \"퐁\"]\n}")
                    writing.end()
                    await console.log(chalk.default.red(this.pkg.createSample))
                    process.exit()
                } else {
                    throw new ReferenceError(this.pkg.files.replace("{}", dir))
                }
            }

            /**
             * @param {number} this.cmdsSize - 저장된 명령어의 개수
             */
            this.cmdsSize = filteredFiles.length

            await filteredFiles.forEach(name => {
                let cmd = require(`${dir}/${name}`)
                if (cmd.config == undefined && cmd.config == null && typeof cmd.config !== "object") {
                    console.error(chalk.default.magenta(this.pkg.notaexportsconfig.replace("{}", name)))
                    process.exit()
                }
                if (cmd.config.name == undefined || cmd.config.aliases == null && cmd.config.name == null || cmd.config.aliases == undefined && typeof cmd.config == "object") {
                    console.error(chalk.default.magenta(this.pkg.whereisnameandaliases.replace("{}", name)))
                    process.exit()
                }
                if (typeof cmd.config.name !== "string") {
                    console.error(chalk.default.magenta(this.pkg.notastring3.replace("{}", name)))
                    process.exit()
                }
                if (!Array.isArray(cmd.config.aliases) && typeof cmd.config.aliases !== "string") {
                    console.error(chalk.default.magenta(this.pkg.typeofaliases.replace("{}", name)))
                    process.exit()
                }
                this.client.commands.set(cmd.config.name, cmd)
                console.log(chalk.default.green(this.pkg.nameloaded.replace("{}", name)))
                for (var alias of cmd.config.aliases) {
                    this.client.aliases.set(alias, cmd)
                    console.log(chalk.default.green(this.pkg.aliasloaded.replace("{}", name)))
                }
            })
            
            console.log(chalk.default.cyan(this.pkg.success))
        })
    }


    /**
     * @param {string} user - 쿨타임을 초기화할 유저의 ID 
     */
    resetCooldown(user) {
        if (typeof user !== "string") throw new TypeError(chalk.default.magenta(this.pkg.notastring4))

        let userid = user.replace(/[^0-9]/g, "")
        this.client.fetchUser(userid).catch(err => {
            let { message } = err
            if (message == "Unknown User") {
                throw new TypeError(chalk.default.magenta(this.pkg.unknownuser))
            } else {
                throw new Error(err)
            }
        })

        if (!cooldownManager.has(userid)) return

        try {
            cooldownManager.delete(userid)
        } catch (err) {
            throw new Error(err)
        }
    }

    /**
     * @param {*} - 모든 유저의 쿨타임 초기화
     */
    resetAllCooldown() {
        try {
            cooldownManager.clear()
        } catch (err) {
            throw new Error(err)
        }
    }
}


module.exports = CmdManager