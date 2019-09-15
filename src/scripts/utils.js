const chalk = require("chalk").default
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

        switch(this.locale) {
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
                throw new ReferenceError(chalk.red("DBCM Error: Unknown Language was configured. '"+this.locale+"' is probably not supported by DBCM. Set by default, which is 'Korean'."))
        }
    }

    /**
     * @param {string|string[]} text - 문자열을 반대로 전환해 출력합니다.
     */
    reverse(text) {
        if (typeof text !== "string" && !Array.isArray(text)) throw new TypeError(chalk.magenta(this.lang.notastring.replace("{}", "text")))

        if (typeof text == "string") {
            return text.split("").reverse().join("")
        } else if (Array.isArray(text)) {
            return text.reverse()
        }
    }
}

module.exports = Utils