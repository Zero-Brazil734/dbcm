/*
WARNING: These are just a few simple shortcuts, 
and if you want to use your own update options, 
you'll need to deal directly with the model, 
such as <model>.findByIdAndUpdate(<query>, <value>, { upsert: true })
*/

const chalk = require("chalk").default

class Controller {
    constructor(client) {
        this.client = client

        this.warning = "WARNING: These are just a few simple shortcuts, and if you want to use your own update options, you'll need to deal directly with the model, such as <model>.findByIdAndUpdate(<query>, <value>, { upsert: true })"
    }

    async setUpdate(modelName, query, value, options = { queryByID: false }) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            if (options.queryByID !== true) { model.findOneAndUpdate(query, { $set: value }) }
            else if (options.queryByID === true) model.findByIdAndUpdate(query, { $set: value })

            return true
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the update(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }

    async pushUpdate(modelName, query, pushvalue, options = { queryByID: false }) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            if (options.queryByID !== true) { model.findOneAndUpdate(query, { $push: pushvalue }) }
            else if (options.queryByID === true) model.findByIdAndUpdate(query, { $push: pushvalue })

            return true
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the update(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }

    async delete(modelName, query, options = { queryByID: false }) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            if (options.queryByID !== true) { model.findOneAndDelete(query) }
            else if (options.queryByID === true) model.findByIdAndDelete(query)

            return true
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the delete(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }

    async create(modelName, value) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            model.create(value)

            return true
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the create(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }

    async getID(modelName, query) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            model.findOne(query, (err, res) => { return res._id })
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the get(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }

    async watch(modelName, data) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            model.watch().on("change", changedData => data(changedData))

            return true
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the watch(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }

    async count(modelName) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            model.countDocuments(n => { return n })
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the count(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }

    async replace(modelName, query, replacement, error, raw) {
        let model = this.client.database.models.get(modelName)
        if (!model) throw new ReferenceError(chalk.red(`This model('${modelName}') doesn't exists.`))

        try {
            model.replaceOne(query, replacement, (err, res) => {
                if (err) return error(err)
                if (res) return res(raw)

                return false
            })
        } catch (err) {
            throw new Error(chalk.red(`An error occurred during the replace(WARNING: This probably won't be a dbcm error): ${err}`))
        }
    }
}

module.exports = Controller