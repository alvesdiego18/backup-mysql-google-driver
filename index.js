const { monitor_backup } = require(`./dist`)

monitor_backup({
    host: ``,
    user: ``,
    password: ``,
    database: ``,

    keep_files: 2,

    cron_active: false,
    cron_time: `*/1 * * * *`,
    cron_timezone: `America/Sao_Paulo`,

    google_drive_active: false,
    google_drive_client_id: ``,
    google_drive_client_secret: ``,
    google_drive_folder_id: ``,
})