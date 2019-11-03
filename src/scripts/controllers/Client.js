const { Collection, Client } = require("discord.js")
const chalk = require("chalk").default
const fs = require("fs")
const { mergeDefault } = require("discord.js/src/util/Util")
const defaults = require("../defaults.js")
const Database = require("./database/index")
const lang = {
    kr: require("../../locales/kr.json"),
    en: require("../../locales/en.json"),
    pt: require("../../locales/pt.json")
}

class DBCM_Client extends Client {
    constructor(options = defaults.clientOptions) {
        super(options)

        this.cooldown = new Collection()
        this.blacklist = new Collection()
        this.commands = new Collection()
        this.aliases = new Collection()

        this.options = options
        this.defaults = defaults

        this.database = new Database(this)


        switch (options.locale !== undefined ? options.locale : options.lang) {
        case "ko-KR":
            console.log(chalk.green("[") + chalk.blue("DBCM") + chalk.green("]") + chalk.yellow(" 언어 설정 완료 - 한국어"))
            this.locale = lang.kr
            break;
        case "pt-BR":
            console.log(chalk.green("[") + chalk.blue("DBCM") + chalk.green("]") + chalk.yellow(" Linguagem configurado com sucesso - Português(Brasil)"))
            this.locale = lang.pt
            break;
        case "en-US":
            console.log(chalk.green("[") + chalk.blue("DBCM") + chalk.green("]") + chalk.yellow(" Language setting was completed - English"))
            this.locale = lang.en
            break;
        default:
            this.locale = lang.en
            console.warn(chalk.red("DBCM Language Error: Unknown language, setting to English which is default"))
            break;
        }
    }

    /**
     * @param {string} path - The directory of command file
     */
    async registerCommand(path) {
        if (typeof path !== "string") throw new TypeError(chalk.red(this.locale.notastring.replace("{}", path)))
        if (fs.existsSync(path) === false) {
            throw new ReferenceError(chalk.red(this.locale.exitsFalse.replace("{}", path)))
        }

        const cmd = require(path)

        if (cmd.config == undefined && cmd.config == null && typeof cmd.config !== "object") {
            console.error(chalk.red(this.locale.notaexportsconfig.replace("{}", name)))
            process.exit()
        }
        if (cmd.config.name == undefined || cmd.config.aliases == null && cmd.config.name == null || cmd.config.aliases == undefined && typeof cmd.config == "object") {
            console.error(chalk.red(this.locale.whereisnameandaliases.replace("{}", name)))
            process.exit()
        }
        if (typeof cmd.config.name !== "string") {
            console.error(chalk.red(this.locale.notastring3.replace("{}", name)))
            process.exit()
        }
        if (!Array.isArray(cmd.config.aliases) && typeof cmd.config.aliases !== "string") {
            console.error(chalk.red(this.locale.typeofaliases.replace("{}", name)))
            process.exit()
        }

        this.commands.set(cmd.config.name, cmd)
        console.log(chalk.green(this.locale.nameloaded.replace("{}", cmd.config.name)))

        for (let i = 0; i < cmd.config.aliases.length; i++) {
            let alias = cmd.config.aliases[i]

            this.aliases.get(alias) ? null : this.aliases.set(alias, cmd)
            console.log(chalk.green(this.locale.aliasloaded.replace("{}", alias)))
        }
    }

    /**
     * @param {string} commandsPath - The folder containing the command files
     * @param {object} options - Registering options
     */
    async registerCommands(commandsPath, options = defaults.registerCommands) {
        options = mergeDefault(defaults.registerCommands, options)
        if (typeof commandsPath !== "string") throw new TypeError(chalk.red(this.locale.notastring.replace("{}", commandsPath)))

        function isError(asdf) {
            asdf !== undefined && asdf !== null && typeof asdf !== "boolean" && typeof asdf == "undefined"
        }

        if (isError(options.createSample)) {
            throw new TypeError(chalk.gray(this.locale.notaboolean.replace("{}", "createSample") + `${this.locale.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }
        if (isError(options.jsFilter)) {
            throw new TypeError(chalk.gray(this.locale.notaboolean.replace("{}", "jsFilter") + `${this.locale.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }

        fs.readdir(commandsPath, async (err, files) => {
            if (err) {
                let mkstr = err.message.toString()
                if (mkstr.includes("ENOENT: no such file or directory, scandir")) {
                    fs.mkdirSync(commandsPath)
                    console.log(chalk.yellow(this.locale.createdir.replace("{}", "commands")));
                    process.exit()
                } else {
                    if (fs.existsSync(commandsPath) === false) {
                        setTimeout(() => process.exit(), 1000)
                        throw new ReferenceError(chalk.red(this.locale.existsFalse.replace("{}", commandsPath)))
                    }
                    throw new Error(err)
                }
            }

            if (options.jsFilter === true) {
                var filtered = files.filter(f => f.split(".").pop() === "js")
            } else {
                var filtered = files
            }

            if (filtered.length <= 0) {
                if (options.createSample === true) {
                    let writing = await fs.createWriteStream(`${commandsPath}/ping.js`, { encoding: "utf-8" })
                    await fs.writeFileSync(`${commandsPath}/ping.js`, "exports.run = (client, message, args) => {\n    message.reply(\"Pong!\")\n}\nexports.config = {\n    name: \"ping\",\n    aliases: [\"pong\", \"pn\", \"핑\", \"퐁\"]\n}")
                    writing.end()
                    await console.log(chalk.blue(this.locale.createSample))
                    process.exit()
                } else {
                    throw new ReferenceError(chalk.red(this.locale.files.replace("{}", commandsPath)))
                }
            }

            filtered.forEach(async name => {
                await this.registerCommand(`${commandsPath.endsWith("/") ? commandsPath + name : `${commandsPath}/${name}`}`)
            })
            console.log(chalk.cyan(this.locale.success))
        })
    }

    /**
     * @param {string} token - The bot's token
     */
    async login(token) {
        if (typeof token !== "string") {
            setTimeout(() => process.exit(), 1000)
            throw new TypeError(chalk.red(this.locale.notastring.replace("{}", token)))
        }

        let black = this.options.blacklist
        if (black !== undefined && black.list !== undefined) {
            if (!Array.isArray(black.list)) throw new TypeError(chalk.red(this.locale.notaarray.replace("{}", "blacklist/list")))
            for (let i = 0; i < black.list.length; i++) {
                if (black.list[i].replace(/[^0-9]/g, "").length < 18) {
                    throw new RangeError(chalk.red(this.locale.asdf.replace("{}", black.list[i])))
                }
                if (typeof black.list[i] !== "string") {
                    throw new TypeError(chalk.red(this.locale.notastring.replace("{}", black.list[i])))
                } else {
                    await this.setBlacklist(black.list[i], black.msg)
                }
            }
            console.log(chalk.cyan(this.locale.blacklist))
        }
        if(this.options.autoReconnect === true) {
            this.on("disconnect", () => {
                console.log(chalk.yellow(this.locale.reconnecting))
                this.login(token)
                    .then(() => {
                        console.log(chalk.cyan(this.locale.successfullyReconnected))
                    })
                    .catch(err => {
                        throw new Error(err)
                    })
            })
        }
        process.env["TOKEN"] === token ? null : process.env["TOKEN"] = token

        super.login(token).catch(err => {
            setTimeout(() => process.exit(), 1000)
            throw new Error(err)
        })
    }

    /**
     * @param {string} userid - Discord UserID
     * @param {string} msg - Optional 
     */
    async setBlacklist(userid, msg) {
        if (typeof userid !== "string") throw new TypeError(chalk.red(this.locale.notastring.replace("{}", userid)))
        if (userid.replace(/[^0-9]/g, "").length < 18) throw new ReferenceError(chalk.red("DBCM Unknown User Error: " + this.locale.asdf.replace("{}", userid)))

        this.blacklist.set(userid, !msg ? this.options.blacklist.msg : msg)
    }

    /**
     * @param {*} userid - Discord UserID
     */
    async deleteBlacklist(userid) {
        if (typeof userid !== "string") throw new TypeError(chalk.red(this.locale.notastring.replace("{}", userid)))
        if (userid.replace(/[^0-9]/g, "").length < 18) throw new ReferenceError(chalk.red("DBCM Unknown User Error: " + this.locale.asdf.replace("{}", userid)))

        this.blacklist.delete(userid)
    }

    /**
     * @param {string} userid - Discord UserID
     */
    async setCooldown(userid) {
        if (typeof userid !== "string") throw new TypeError(chalk.red(this.locale.notastring.replace("{}", userid)))
        if (userid.replace(/[^0-9]/g, "").length < 18) throw new ReferenceError(chalk.red("DBCM Unknown User Error: " + this.locale.asdf.replace("{}", userid)))

        this.cooldown.set(userid, this.options !== undefined ? this.options.cooldown !== undefined ? this.options.cooldown.msg ? this.options.cooldown.msg : undefined : undefined : undefined)
    }

    /**
     * @param {string} userid - Discord UserID
     */
    async deleteCooldown(userid) {
        if (typeof userid !== "string") throw new TypeError(chalk.red(this.locale.notastring.replace("{}", userid)))
        if (userid.replace(/[^0-9]/g, "").length < 18) throw new ReferenceError(chalk.red("DBCM Unknown User Error: " + this.locale.asdf.replace("{}", userid)))

        this.cooldown.get(userid) ? this.cooldown.delete(userid) : null
    }

    /**
     * @param {*} - Resets cooldown for everyone
     */
    async deleteAllCooldown() {
        this.cooldown.deleteAll()
    }

    /**
     * @param {*} - Get cooldown of the bot
     */
    get cooltime() {
        return this.options !== undefined ? this.options.cooldown !== undefined ? this.options.cooldown.time !== undefined ? this.options.cooldown.time : null : null : null
    }

    /**
     * @param {string} command - The command in the string message. (e.g. <message in array>.shift().toLowerCase())
     * @param {object} message - The message event object in discord.js
     * @param {string[]} args - The message content in Array (e.g. <message>.content.slice("prefix".length).trim().split(/ +/g);)
     * @param {object} hdo - Your options for handling command 
     */
    async runCommand(command, message, args, hdo = {}) {
        if (typeof command !== "string") throw new TypeError(chalk.red(this.locale.notastring.replace("{}", command)))
        if (typeof message !== "object") throw new TypeError(chalk.red(this.locale.notaobject.replace("{}", message)))
        if (!Array.isArray(args)) throw new TypeError(chalk.red(this.locale.notaarray.replace("{}", args)))
        if (hdo !== {} && typeof hdo !== "object") throw new TypeError(chalk.red(this.locale.notaobject.replace("{}", hdo)))

        let opt = this.options
        let black = this.options.blacklist
        let cool = this.options.cooldown
        if (this.commands.get(command)) {
            if (this.blacklist.get(message.author.id) && opt !== undefined && black !== undefined && black.list !== undefined) {
                let dev = this.options.dev
                if(typeof dev === "string" && message.author.id !== dev) return black.msg !== undefined ? message.channel.send(black.msg.replace("%{message.author}", message.author).replace("%{message.author.id}", message.author.id).replace("%{message.guild.name}", message.guild.name).replace("%{message.guild.id}", message.guild.id)) : null
                if(Array.isArray(dev) && !dev.includes(message.author.id)) return black.msg !== undefined ? message.channel.send(black.msg.replace("%{message.author}", message.author).replace("%{message.author.id}", message.author.id).replace("%{message.guild.name}", message.guild.name).replace("%{message.guild.id}", message.guild.id)) : null
            }
            if (this.cooldown.get(message.author.id) && opt !== undefined && cool !== undefined && cool.time !== undefined) {
                return cool.msg !== undefined ? message.channel.send(cool.msg.replace("%{message.author}", message.author).replace("%{message.author.id}", message.author.id).replace("%{message.guild.name}", message.guild.name).replace("%{message.guild.id}", message.guild.id).replace("%{cmd.cooldown}", cool.time)) : null
            }

            hdo !== {} ? this.commands.get(command).run(this, message, args) : this.commands.get(command).run(this, message, args, hdo)

            if (opt !== undefined && cool !== undefined && cool.time !== undefined) {
                let dev = this.options.dev
                if(typeof dev === "string" && message.author.id === dev) return
                if(Array.isArray(dev) && dev.includes(message.author.id)) return
                if(this.options.ignoreCooldownIfIsAdmin === true && message.guild !== undefined && message.member.hasPermission("ADMINSTRATOR")) return
                
                this.setCooldown(message.author.id)
                setTimeout(() => {
                    this.deleteCooldown(message.author.id)
                }, parseInt(cool.time, 10))
            }
        }

        if (this.aliases.get(command)) {
            if (this.blacklist.get(message.author.id) && opt !== undefined && black !== undefined && black.list !== undefined) {
                let dev = this.options.dev
                if(typeof dev === "string" && message.author.id !== dev) return black.msg !== undefined ? message.channel.send(black.msg.replace("%{message.author}", message.author).replace("%{message.author.id}", message.author.id).replace("%{message.guild.name}", message.guild.name).replace("%{message.guild.id}", message.guild.id)) : null
                if(Array.isArray(dev) && !dev.includes(message.author.id)) return black.msg !== undefined ? message.channel.send(black.msg.replace("%{message.author}", message.author).replace("%{message.author.id}", message.author.id).replace("%{message.guild.name}", message.guild.name).replace("%{message.guild.id}", message.guild.id)) : null
            }
            if (this.cooldown.get(message.author.id) && opt !== undefined && cool !== undefined && cool.time !== undefined) {
                return cool.msg !== undefined ? message.channel.send(cool.msg.replace("%{message.author}", message.author).replace("%{message.author.id}", message.author.id).replace("%{message.guild.name}", message.guild.name).replace("%{message.guild.id}", message.guild.id).replace("%{cmd.cooldown}", cool.time)) : null
            }

            hdo !== {} ? this.aliases.get(command).run(this, message, args) : this.aliases.get(command).run(this, message, args, hdo)

            if (opt !== undefined && cool !== undefined && cool.time !== undefined) {
                let dev = this.options.dev
                if(typeof dev === "string" && message.author.id === dev) return
                if(Array.isArray(dev) && dev.includes(message.author.id)) return
                if(Array.isArray(this.options.ignoresCooldown) && this.options.ignoresCooldown.includes(message.author.id)) return 
                if(this.options.ignoreCooldownIfIsAdmin === true && message.guild !== undefined && message.member.hasPermission("ADMINSTRATOR")) return

                this.setCooldown(message.author.id)
                setTimeout(() => {
                    this.deleteCooldown(message.author.id)
                }, parseInt(cool.time, 10))
            }
        }
    }
}

module.exports = DBCM_Client