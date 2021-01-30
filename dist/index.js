const CronJob = require('cron').CronJob;

const logger = require('perfect-logger');
logger.initialize('Log', {
    logLevelFile: 0,                    // Log level for file
    logLevelConsole: 0,                 // Log level for STDOUT/STDERR
    logDirectory: 'logs/',              // Log directory
    customBannerHeaders: '### Log ###'  // Custom Log Banner
});

const backup = require(`./backup`)

function initCron(optinos) {    

    if (optinos.cron_active) {

        logger.info('cron!')

        if (optinos.cron_time) {

            logger.info('cron iniciando...')
            logger.info(`time cron run ${optinos.cron_time}`)

            const job = new CronJob(optinos.cron_time, function () {

                logger.info('run cron...')
                backup(optinos)

            }, null, true, optinos.cron_timezone);

            job.start();
        }
    }
    else {

        logger.info('run not cron!')
        backup(optinos)
    }
}

module.exports = {
    monitor_backup: initCron
}