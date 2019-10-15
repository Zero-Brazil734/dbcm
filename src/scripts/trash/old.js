const chalk = require("chalk").default

class bot {
    constructor() {
        setTimeout(() => process.exit(), 1000)
        throw new ReferenceError(chalk.red("DBCM Deprecated Action Error: 'bot' class is now deprecated. Please visit here to see new examples: https://github.com/Zero-Brazil734/dbcm/blob/master/updates.md#dbcm-v128"))
    }
}

module.exports = bot