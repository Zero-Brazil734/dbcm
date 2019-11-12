const chalk = require("chalk").default
const request = require("request")
const locales = {
    kr: require("../../locales/kr.json"),
    pt: require("../../locales/pt.json"),
    en: require("../../locales/en.json")
}


class Utils {
    constructor(options = { lang: "ko-KR" }) {
        /**
         * @param {string} this.licenses - The license comparison list, in Korean
         */
        this.licenses = "https://www.olis.or.kr/license/compareGuide.do"

        /**
         * @param {string} this.utilsLocale - The language that is used in DBCM Utils
         */
        this.utilsLocale = options.lang

        switch (options.lang) {
        case "ko-KR":
            this.lang = locales.kr
            break
        case "pt-BR":
            this.lang = locales.pt
            break
        case "en-US":
            this.lang = locales.en
            break
        default:
            this.lang = locales.en
            console.warn(chalk.red("DBCM Error: Unknown Language was configured. '" + options.lang + "' is probably not supported by DBCM. Set by default, which is 'English'."))
        }
    }

    /**
     * @param {string|string[]} text - Reverse array or string content (Example: 'this is a testing msg' => 'gsm gnitset a si siht')
     */
    async reverse(text) {
        if (typeof text !== "string" && !Array.isArray(text)) throw new TypeError(chalk.magenta(this.lang.notastringorarray.replace("{}", "text")))

        if (typeof text == "string") {
            return await text.split("").reverse().join("")
        } else if (Array.isArray(text)) {
            return await text.reverse()
        }
    }

    /**
     * @param {string} text - A string text to extract the numbers
     * @param {object} options - Options of filtering
     * @param {boolean} options.toNumber - Set whether to convert to number
     */
    async numberFilter(text, options = { toNumber: false }) {
        if (typeof text !== "string") throw new TypeError(chalk.magenta(this.lang.notastring.replace("{}", "text")))

        let filtered = text.replace(/[^0-9]/g, "")
        if (options.toNumber === false) {
            var result = filtered
        } else {
            if (isNaN(parseInt(filtered, 10))) {
                var result = filtered
                throw new SyntaxError(chalk.magenta(this.lang.isNaN.replace("{}", result)))
            } else {
                var result = parseInt(filtered, 10)
            }
        }

        return await result
    }

    /**
     * @param {string} query - The name of data to search in Discord Status API.
     * @param {object} callbackData - Search data result callback.
     */
    async discordStatus(query, callbackData) {
        if (typeof query !== "string") throw new TypeError(chalk.magenta(this.lang.notastring.replace("{}", "query")))

        switch (query) {
        case "summary":
            await request("https://srhpyqt94yxb.statuspage.io/api/v2/summary.json", (err, res, body) => {
                if (err) throw new Error(err)

                let parsed = JSON.parse(body)
                return callbackData(parsed)
            })
            break
        case "status":
            await request("https://srhpyqt94yxb.statuspage.io/api/v2/status.json", (err, res, body) => {
                if (err) throw new Error(err)

                let parsed = JSON.parse(body).status
                return callbackData(parsed)
            })
            break
        case "unresolved_incidents":
            await request("https://srhpyqt94yxb.statuspage.io/api/v2/incidents/unresolved.json", (err, res, body) => {
                if (err) throw new Error(err)

                let parsed = JSON.parse(body).incidents
                return callbackData(parsed)
            })
            break
        case "all_incidents":
            await request("https://srhpyqt94yxb.statuspage.io/api/v2/incidents.json", (err, res, body) => {
                if (err) throw new Error(err)

                let parsed = JSON.parse(body).incidents
                return callbackData(parsed)
            })
            break
        case "upcoming_maintenances":
            await request("https://srhpyqt94yxb.statuspage.io/api/v2/scheduled-maintenances/upcoming.json", (err, res, body) => {
                if (err) throw new Error(err)

                let parsed = JSON.parse(body).scheduled_maintenances
                return callbackData(parsed)
            })
            break
        case "active_maintenances":
            await request("https://srhpyqt94yxb.statuspage.io/api/v2/scheduled-maintenances/active.json", (err, res, body) => {
                if (err) throw new Error(err)

                let parsed = JSON.parse(body).scheduled_maintenances
                return callbackData(parsed)
            })
            break
        case "all_maintenances":
            await request("https://srhpyqt94yxb.statuspage.io/api/v2/scheduled-maintenances.json", (err, res, body) => {
                if (err) throw new Error(err)

                let parsed = JSON.parse(body).scheduled_maintenances
                return callbackData(parsed)
            })
            break
        default:
            throw new ReferenceError(chalk.magenta(this.lang.unknownData.replace("{}", query)))
        }
    }
}

module.exports = Utils 