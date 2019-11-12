module.exports = {
    registerCommands: {
        createSample: true,
        jsFilter: true
    },
    registerModels: {
        jsFilter: true
    },
    dbConnectOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    clientOptions: {
        apiRequestMethod: "sequential",
        shardId: 0,
        shardCount: 0,
        messageCacheMaxSize: 200,
        messageCacheLifetime: 0,
        messageSweepInterval: 0,
        fetchAllMembers: false,
        disableEveryone: false,
        sync: false,
        restWsBridgeTimeout: 5000,
        retryLimit: Infinity,
        disabledEvents: [],
        restTimeOffset: 500,

        /**
         * WebSocket options (these are left as snake_case to match the API)
         * @typedef {Object} WebsocketOptions
         * @property {number} [large_threshold=250] Number of members in a guild to be considered large
         * @property {boolean} [compress=true] Whether to compress data sent on the connection
         * (defaults to `false` for browsers)
         */
        ws: {
            large_threshold: 250,
            compress: require("os").platform() !== "browser",
            properties: {
                $os: process ? process.platform : "discord.js",
                $browser: "discord.js",
                $device: "discord.js",
                $referrer: "",
                $referring_domain: "",
            },
            version: 6,
        },

        /**
         * HTTP options
         * @typedef {Object} HTTPOptions
         * @property {number} [version=7] API version to use
         * @property {string} [api="https://discordapp.com/api"] Base url of the API
         * @property {string} [cdn="https://cdn.discordapp.com"] Base url of the CDN
         * @property {string} [invite="https://discord.gg"] Base url of invites
         */
        http: {
            version: 7,
            host: "https://discordapp.com",
            cdn: "https://cdn.discordapp.com",
        },

        locale: "en-US",
        autoReconnect: false,
        dev: [],
        ignoresCooldown: [],
        ignoreCooldownIfIsAdmin: false,
        cooldown: {
            time: undefined,
            msg: undefined
        },
        blacklist: {
            list: [],
            msg: undefined
        },
        autoRegistryCommands: true
    }
}