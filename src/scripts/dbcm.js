const { Collection } = require("discord.js")
const fs = require("fs")
const chalk = require("chalk")
const cooldownManager = new Set()
const pkg = {
    kr: require("../locales/kr.json"),
    pt: require("../locales/pt.json"),
    en: require("../locales/en.json")
}

class CmdManager {
    constructor(client, options = { lang: "kr" }) {
        this.client = client
        this.client.aliases = new Collection()
        this.client.commands = new Collection()

        /** 
         * @param {string} this.dbcmLocale - The language that is used in DBCM CmdManager
        */
        this.dbcmLocale = options.lang
        

        switch (this.dbcmLocale) {
            case "kr":
                this.lang = pkg.kr
                break;
            case "pt":
                this.lang = pkg.pt
                break;
            case "en":
                this.lang = pkg.en
                break;
            default:
                this.lang = pkg.en
                throw new ReferenceError(chalk.red("DBCM Error: Unknown Language was configured. '" + this.dbcmLocale + "' is probably not supported by DBCM. Set by default, which is 'English'."))
        }
    }

    /**
     * @param {string} command - cmd of message event(Example: const command = args.shift().toLowerCase())
     * @param {object} msg - message event
     * @param {string[]} args - message content in form of array.(Example: const args = message.content.slice("<prefix>".length).trim().split(/ +/g))
     * @param {object} options - custom options of command
     * @param {number} options.cooldown - sets the cooldown of cmd
     * @param {string} options.cdmsg - sets the cooldown message of cmd
     * @param {object} hdo - sets your custom handling options. Setting: runCommand(..., { db: database, password: "asdf" }), calling: exports.run = (client, msg, args, asdf.password)
     */
    runCommand(command, msg, args, options = { cooldown: 0, cdmsg: "undefined" }, hdo = {}) {
        if (typeof command !== "string") throw new TypeError(chalk.default.magenta(this.lang.notastring.replace("{}", "command")) + chalk.default.gray(`${this.lang.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        if (typeof msg !== "object") throw new TypeError(chalk.default.magenta(this.lang.notaobject.replace("{}", "message") + chalk.default.gray(`${this.lang.example}:\nhttps://github.com/Zero-Brazil734/dbcm`)))
        if (!Array.isArray(args)) throw new TypeError(chalk.default.magenta(this.lang.notaarray.replace("{}", "args") + chalk.default.gray(`${this.lang.example}:\nhttps://github.com/Zero-Brazil734/dbcm`)))
        if (options.cooldown !== undefined && options.cooldown !== null && typeof options.cooldown !== "number" && options.cooldown >= 0 && options.cooldown < 3000) throw new RangeError(chalk.default.magenta(this.lang.minimumis3))
        if (options.cooldown !== undefined && options.cooldown !== null && typeof options.cooldown !== "number" && options.cooldown > 60000 * 5) throw new RangeError(chalk.default.magenta(this.lang.maximumis5))
        if (options !== undefined && options.cooldown !== undefined && options.cdmsg === "undefined" && options.cooldown >= 3000 && options.cdmsg !== undefined && options.cdmsg === "") throw new SyntaxError(chalk.default.magenta(this.lang.cdmsg))

        /**
         * @param {number} this.cmdsCooldown - Shows the cooldown of cmds
         */
        this.cmdsCooldown = options.cooldown
        /**
         * @param {string} this.cooldownMsg - Shows the cooldown message of cmds
         */
        this.cooldownMsg = options.cdmsg

        if (this.client.commands.get(command)) {
            try {
                if (cooldownManager.has(msg.author.id) && options.cdmsg !== "undefined") {
                    return options.cdmsg !== "undefined" && options.cdmsg !== undefined && options.cdmsg !== "" ? msg.channel.send(options.cdmsg) : undefined
                }
                hdo == {} ? this.client.commands.get(command).run(this.client, msg, args) : this.client.commands.get(command).run(this.client, msg, args, hdo)
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
                hdo == {} ? this.client.aliases.get(command).run(this.client, msg, args) : this.client.aliases.get(command).run(this.client, msg, args, hdo)
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
     * @param {string} dir - Commands directory. Is only available with __dirname, not "./commands". (Example: __dirname+"/commands")
     * @param {boolean} options.jsFilter - Define if saves only JavaScript Files 
     * @param {boolean} options.createSample - define if no files exist, create a sample file
     */
    registerCommands(dir, options = { createSample: true, jsFilter: true }) {
        if (typeof dir !== "string") {
            throw new TypeError(this.lang.notastring2 + chalk.default.gray(`${this.lang.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }
        function isError(asdf) {
            asdf !== undefined && asdf !== null && typeof asdf !== "boolean" && typeof asdf == "undefined"
        }
        if (isError(options.createSample)) {
            throw new TypeError(chalk.default.gray(this.lang.notaboolean.replace("{}", "createSample") + `${this.lang.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }
        if (isError(options.jsFilter)) {
            throw new TypeError(chalk.default.gray(this.lang.notaboolean.replace("{}", "jsFilter") + `${this.lang.example}:\nhttps://github.com/Zero-Brazil734/dbcm`))
        }

        /**
         * @param {object} this.registerOptions - Shows command saving options on object.
         */
        this.registerOptions = options
        /**
         * @param {string} this.cmdsDir - Shows the directory used to register commands
         */
        this.cmdsDir = dir

        fs.readdir(dir, async (err, files) => {
            if (err) {
                let mkstr = err.message.toString()
                if (mkstr.includes("ENOENT: no such file or directory, scandir")) {
                    fs.mkdirSync(dir)
                    console.log(chalk.default.yellow(this.lang.createdir.replace("{}", "commands")));
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
                    await console.log(chalk.default.red(this.lang.createSample))
                    process.exit()
                } else {
                    throw new ReferenceError(this.lang.files.replace("{}", dir))
                }
            }

            /**
             * @param {number} this.cmdsSize - Show total saved commands
             */
            this.cmdsSize = filteredFiles.length

            await filteredFiles.forEach(name => {
                let cmd = require(`${dir}/${name}`)
                if (cmd.config == undefined && cmd.config == null && typeof cmd.config !== "object") {
                    console.error(chalk.default.magenta(this.lang.notaexportsconfig.replace("{}", name)))
                    process.exit()
                }
                if (cmd.config.name == undefined || cmd.config.aliases == null && cmd.config.name == null || cmd.config.aliases == undefined && typeof cmd.config == "object") {
                    console.error(chalk.default.magenta(this.lang.whereisnameandaliases.replace("{}", name)))
                    process.exit()
                }
                if (typeof cmd.config.name !== "string") {
                    console.error(chalk.default.magenta(this.lang.notastring3.replace("{}", name)))
                    process.exit()
                }
                if (!Array.isArray(cmd.config.aliases) && typeof cmd.config.aliases !== "string") {
                    console.error(chalk.default.magenta(this.lang.typeofaliases.replace("{}", name)))
                    process.exit()
                }
                this.client.commands.set(cmd.config.name, cmd)
                console.log(chalk.default.green(this.lang.nameloaded.replace("{}", name)))
                for (var alias of cmd.config.aliases) {
                    this.client.aliases.set(alias, cmd)
                    console.log(chalk.default.green(this.lang.aliasloaded.replace("{}", name)))
                }
            })

            console.log(chalk.default.cyan(this.lang.success))
        })
    }


    /**
     * @param {string} user - UserID to reset cooldown
     */
    resetCooldown(user) {
        if (typeof user !== "string") throw new TypeError(chalk.default.magenta(this.lang.notastring4))

        let userid = user.replace(/[^0-9]/g, "")
        this.client.fetchUser(userid).catch(err => {
            let { message } = err
            if (message == "Unknown User") {
                throw new TypeError(chalk.default.magenta(this.lang.unknownuser))
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
     * @param {*} - Resets the cooldowns of everyone
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