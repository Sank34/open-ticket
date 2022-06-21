const index = require("../index")

if (index.developerMode){
    var config = require("../devConfig.json")
}else{var config = require("../config.json")}


var localLanguage = require("../language/english.json")
if (config.languagefile.startsWith("custom")) localLanguage = require("../language/custom.json")
else if (config.languagefile.startsWith("dutch")) localLanguage = require("../language/dutch.json")
else if (config.languagefile.startsWith("english")) localLanguage = require("../language/english.json")
else if (config.languagefile.startsWith("deutsch")) localLanguage = require("../language/deutsch.json")
else if (config.languagefile.startsWith("french")) localLanguage = require("../language/french.json")


const errorLog = async () => {
    const chalk = await (await import("chalk")).default

    console.log(chalk.red("Something went wrong when loading the language!")+"\nCheck the config file or create a ticket in our server!")
}

const successLog = async () => {
    const chalk = await (await import("chalk")).default

    console.log(chalk.green("loaded language file..."))
}

if (!localLanguage){
    const runError = async () => {
        await errorLog()
        process.exit(1)
    }
    runError()
}else{
    exports.language = localLanguage
    successLog()
}