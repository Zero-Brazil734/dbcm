const mongoose = require("mongoose")
const { mergeDefault } = require("discord.js/src/util/Util")
const chalk = require("chalk").default
const { Collection } = require("discord.js")
const fs = require("fs")
const files = {
    en: require("../../../locales/en.json"),
    kr: require("../../../locales/kr.json"),
    pt: require("../../../locales/pt.json")
}

class Database {
    constructor(client) {
        this.client = client
        this.connected = false

        this.models = new Collection()

        switch (this.client.options.locale !== undefined ? this.client.options.locale : this.client.options.lang) {
        case "ko-KR":
            this.locale = files.kr
            break
        case "en-US":
            this.locale = files.en
            break
        case "pt-BR":
            this.locale = files.pt
            break
        }
    }

    async connect(uri, options) {
        let result = mergeDefault(this.client.defaults.dbConnectOptions, options)
        mongoose.connect(String(uri), result)
            .then(() => {
                this.connected = true

                console.log(chalk.green("[") + chalk.blue("MongoDB") + chalk.green("]") + " Database connection stabilized successfully.")
            })
            .catch(error => { throw new Error(chalk.red(error)) })
    }

    async registerModels(directory, options = this.client.defaults.registerModels) {
        fs.readdir(directory, (err, nonfilteredfiles) => {
            if (err) new Error(chalk.red(err))

            if (options.jsFilter === true) {
                var files = nonfilteredfiles.filter(f => f.split(".").pop() === "js")
            } else {
                var files = nonfilteredfiles
            }
            if(files.length <= 0) throw new RangeError(chalk.red("DBCM Database Error: " + this.locale.nomodel))

            files.forEach(file => {
                let modelName = file.split(".").shift().toLowerCase()
                let model = require(directory + "/" + file)

                this.models.set(modelName, model)
                console.log(`${chalk.green("[")}${chalk.blue("MongoDB")}${chalk.green("]")} `+this.locale.modelwassaved.replace("{}", modelName))
            })
        })
    }
}

module.exports = Database