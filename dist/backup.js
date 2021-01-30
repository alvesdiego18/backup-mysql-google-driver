require('dotenv').config()
const mysqldump = require('mysqldump')
const fs = require('fs')
const moment = require('moment')
const logger = require(`perfect-logger`)

const sendFile = require('./file')
const mail = require('./email')

async function init(options) {

    /** Format file name */
    const fileName = `${options.backup.database}_backup_${moment().format('YYYY-MM-DD_HH_mm-ss')}.sql`
    const dir = options.backup.folder_backups ? options.backup.folder_backups : `./backup`
    const folderfileName = `${dir}/${fileName}`

    //** Verify if directory exists */
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    /** delete old items */
    await deleteOldFiles(options)

    /** backup database */
    await backupFile(fileName, folderfileName, options)

    /** send file google drive */
    await sendFileToGoogleDrive(fileName, folderfileName, options)

    //** send mail notification */
    await mail.sendMail(options)
}

async function sendFileToGoogleDrive(fileName, folderfileName, options) {

    try {

        /** send file to google drive */
        if (options.google_drive.active) {

            if (options.google_drive.client_id === '' || options.google_drive.client_secret === '') {
                logger.info(`- !## account backup google drive not configured! ##`)
                logger.info(`- Please, check this link => https://developers.google.com/drive/api/v3/quickstart/nodejs`)
                logger.info(`finish backup`)
                return
            }

            const tokenExist = fs.existsSync('./token.json')
            if (!tokenExist) {
                logger.info(`- !## backup google drive configured but token not valid! ##`)
                logger.info(`- please follow the next steps`)
            }

            sendFile.send(fileName, folderfileName, options, (data) => {

                logger.info(`renaming file`)
                setTimeout(async () => {
                    await fs.renameSync(folderfileName, `${options.backup.folder_backups}/${data}.sql`)

                    fs.appendFileSync(`${options.backup.folder_backups}/db.json`, `${data}\n`, (err) => {
                        if (err) throw err;
                    });

                    logger.info(`backup sending to google drive with success!`)
                    logger.info(`finish backup`)

                }, 2000);
            })
        }
        else {
            logger.info(`finish backup`)
        }

    } catch (error) {

        logger.info(`error send file to google drive => ${error}`)
    }
}

async function backupFile(fileName, folderfileName, options) {

    try {

        logger.info(`running backup`)

        /** Config the access database */
        const config = {
            connection: {
                host: options.backup.host,
                user: options.backup.user,
                password: options.backup.password,
                database: options.backup.database,
            },
            dumpToFile: folderfileName,
        }

        /** backup */
        await mysqldump(config);

        if (!options.google_drive.active)
            fs.appendFileSync(`${options.backup.folder_backups}/db.json`, `${fileName}\n`, (err) => {
                if (err) throw err;
            });

    } catch (error) {

        logger.info(`error ao execute backup file database => ${error}`)
    }
}

async function deleteOldFiles(options) {

    try {

        if (fs.existsSync(`${options.backup.folder_backups}/db.json`)) {

            logger.info(`deleting old backups`)

            fs.readFile(`${options.backup.folder_backups}/db.json`, 'utf8', async function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {

                    const list = data.split('\n')
                    const keepFiles = options.backup.keep_files ? options.backup.keep_files : 10

                    if (list.length > Number(keepFiles)) {

                        const deleteLocalFile = async (extensionFile = ``) => {

                            let newList = ''
                            let index = 0
                            for (const fileDelete of list) {

                                if (fileDelete === '')
                                    continue

                                if (index === 0) {

                                    if (await fs.existsSync(`${options.backup.folder_backups}/${fileDelete}${extensionFile}`))
                                        await fs.unlinkSync(`${options.backup.folder_backups}/${fileDelete}${extensionFile}`)

                                    index++
                                    continue
                                }

                                newList += `${fileDelete}\n`
                                index++
                            }

                            await fs.writeFileSync(`${options.backup.folder_backups}/db.json`, newList)
                        }

                        if (!options.google_drive.active) {
                            await deleteLocalFile()
                        }
                        else {
                            sendFile.delete(options, list[0], async (data) => {

                                await deleteLocalFile(`.sql`)
                            })
                        }
                    }
                }
            });
        }

    } catch (error) {

        logger.info(`error delete old file => ${error}`)
    }
}

module.exports = init