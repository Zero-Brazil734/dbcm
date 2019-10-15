#!/dbcm/src/env node

/**
 * @param {string} version - The version of 'dbcm' package
 */
const version = require("../package.json").version
const Client = require("./scripts/controllers/Client")
const Utils = require("./scripts/controllers/utils")
const bot = require("./scripts/trash/old")

module.exports = {
    version,
    Client,
    Utils,
    bot: bot
}
