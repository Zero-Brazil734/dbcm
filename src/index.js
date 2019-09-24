#!/dbcm/src/env node

/**
 * @param {string} version - The version of 'dbcm' package
 */
const version = `v${require("../package.json").version}`

module.exports = {
    bot: require("./scripts/dbcm"),
    utils: require("./scripts/utils"),
    version: version
}
