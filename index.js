const { monitor_backup } = require(`./dist`)
// module.exports = monitor_backup

monitor_backup({

    backup: {
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'unlock',
        keep_files: 2,
    }
})