const CronJob = require('cron').CronJob;

const logger = require('perfect-logger');
logger.initialize('Log', {
    logLevelFile: 0,                    // Log level for file
    logLevelConsole: 0,                 // Log level for STDOUT/STDERR
    logDirectory: 'logs/',              // Log directory
    customBannerHeaders: '### Log ###'  // Custom Log Banner
});

const backup = require(`./backup`)

function initCron(options) {    

    if (options.cron.active) {

        logger.info('cron!')

        if (options.cron.time) {

            logger.info('cron starting...')
            logger.info(`time cron run ${options.cron.time}`)

            const job = new CronJob(options.cron.time, function () {

                logger.info('run cron...')
                backup(options)

            }, null, true, options.cron.timezone);

            job.start();
        }
    }
    else {

        logger.info('run not cron!')
        backup(options)
    }
}

module.exports = {
    monitor_backup: initCron
}