const chalk = require("chalk").default
const request = require("request")
const locales = {
    kr: require("../locales/kr.json"),
    pt: require("../locales/pt.json"),
    en: require("../locales/en.json")
}


class Utils {
    constructor(client, options = { lang: "kr" }) {
        this.client = client
        this.licenses = "https://www.olis.or.kr/license/compareGuide.do"
        this.locale = options.lang


        switch (this.locale) {
            case "kr":
                this.lang = locales.kr
                break;
            case "pt":
                this.lang = locales.pt
                break;
            case "en":
                this.lang = locales.en
                break;
            default:
                this.lang = locales.kr
                throw new ReferenceError(chalk.red("DBCM Error: Unknown Language was configured. '" + this.locale + "' is probably not supported by DBCM. Set by default, which is 'Korean'."))
        }
    }

    /**
     * @param {string|string[]} text - 문자열을 반대로 전환해 출력합니다.
     */
    reverse(text) {
        if (typeof text !== "string" && !Array.isArray(text)) throw new TypeError(chalk.magenta(this.lang.notastringorarray.replace("{}", "text")))

        if (typeof text == "string") {
            return text.split("").reverse().join("")
        } else if (Array.isArray(text)) {
            return text.reverse()
        }
    }

    /**
     * @param {string} query - 디스코드 Status API에 검색할 데이터 이름 
     * @param {object} callbackData - 검색 결과의 callback
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
                break;
            case "status":
                await request("https://srhpyqt94yxb.statuspage.io/api/v2/status.json", (err, res, body) => {
                    if (err) throw new Error(err)

                    let parsed = JSON.parse(body).status
                    return callbackData(parsed)
                })
                break;
            case "unresolved_incidents":
                await request("https://srhpyqt94yxb.statuspage.io/api/v2/incidents/unresolved.json", (err, res, body) => {
                    if (err) throw new Error(err)

                    let parsed = JSON.parse(body).incidents
                    return callbackData(parsed)
                })
                break;
            case "all_incidents":
                await request("https://srhpyqt94yxb.statuspage.io/api/v2/incidents.json", (err, res, body) => {
                    if (err) throw new Error(err)

                    let parsed = JSON.parse(body).incidents
                    return callbackData(parsed)
                })
                break;
            case "upcoming_maintenances":
                await request("https://srhpyqt94yxb.statuspage.io/api/v2/scheduled-maintenances/upcoming.json", (err, res, body) => {
                    if (err) throw new Error(err)

                    let parsed = JSON.parse(body).scheduled_maintenances
                    return callbackData(parsed)
                })
                break;
            case "active_maintenances":
                await request("https://srhpyqt94yxb.statuspage.io/api/v2/scheduled-maintenances/active.json", (err, res, body) => {
                    if (err) throw new Error(err)

                    let parsed = JSON.parse(body).scheduled_maintenances
                    return callbackData(parsed)
                })
                break;
            case "all_maintenances":
                await request("https://srhpyqt94yxb.statuspage.io/api/v2/scheduled-maintenances.json", (err, res, body) => {
                    if (err) throw new Error(err)

                    let parsed = JSON.parse(body).scheduled_maintenances
                    return callbackData(parsed)
                })
                break;
            default:
                throw new ReferenceError(chalk.magenta(this.lang.unknownData.replace("{}", query)))
        }
    }
}


module.exports = Utils