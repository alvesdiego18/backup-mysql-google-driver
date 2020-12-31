const CronJob = require('cron').CronJob;
const init = require(`./dist/init`)

if (process.env.BACKUP_DRIVE_CRON_ACTIVE === `true`) {

    console.log('Cron!')
    if (process.env.BACKUP_DRIVE_CRON) {

        console.log('Cron iniciando...')
        console.log('Tempo cron', process.env.BACKUP_DRIVE_CRON)
        const job = new CronJob(process.env.BACKUP_DRIVE_CRON, function () {

            console.log('Rodando cron...')
            init()

        }, null, true, process.env.BACKUP_DRIVE_TIMEZONE);

        job.start();
    }
}
else {

    console.log('No Cron!')
    init()
}