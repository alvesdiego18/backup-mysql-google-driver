require('dotenv').config()
const mysqldump = require('mysqldump')
const fs = require('fs')
const moment = require('moment')
const logger = require(`perfect-logger`)

const sendFile = require('./file')

async function init(options) {

    /** Format file name */
    const fileName = `${options.database}_backup_${moment().format('YYYY-MM-DD_HH_mm-ss')}.sql`
    const folderfileName = `./backup/${fileName}`

    /** delete old items */
    await deleteOldFiles(options)

    /** backup database */
    await backupFile(fileName, folderfileName, options)

    /** send file google drive */
    await sendFileToGoogleDrive(fileName, folderfileName, options)
}

async function sendFileToGoogleDrive(fileName, folderfileName, options) {

    try {

        /** send file to google drive */
        if (options.google_drive_active) {

            sendFile.send(fileName, folderfileName, options, (data) => {

                logger.info(`renaming file`)
                setTimeout(async () => {
                    await fs.renameSync(folderfileName, `./backup/${data}.sql`)

                    fs.appendFileSync('./backup/db.json', `${data}\n`, (err) => {
                        if (err) throw err;
                    });

                    logger.info(`file sending success!`)
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
                host: options.host,
                user: options.user,
                password: options.password,
                database: options.database,
            },
            dumpToFile: folderfileName,
        }

        /** backup */
        await mysqldump(config);

        if (!options.google_drive_active)
            fs.appendFileSync('./backup/db.json', `${fileName}\n`, (err) => {
                if (err) throw err;
            });

    } catch (error) {

        logger.info(`error ao execute backup file database => ${error}`)
    }
}

async function deleteOldFiles(options) {

    try {

        if (fs.existsSync('./backup/db.json')) {

            logger.info(`deleting old files`)

            fs.readFile('./backup/db.json', 'utf8', async function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {

                    const list = data.split('\n')
                    const keepFiles = options.keep_files ? options.keep_files : 10

                    if (list.length > Number(keepFiles)) {

                        const deleteLocalFile = async (extensionFile = ``) => {

                            let newList = ''
                            let index = 0
                            for (const fileDelete of list) {

                                if (fileDelete === '')
                                    continue

                                if (index === 0) {

                                    if (await fs.existsSync(`./backup/${fileDelete}${extensionFile}`))
                                        await fs.unlinkSync(`./backup/${fileDelete}${extensionFile}`)

                                    index++
                                    continue
                                }

                                newList += `${fileDelete}\n`
                                index++
                            }

                            await fs.writeFileSync('./backup/db.json', newList)
                        }

                        if (!options.google_drive_active) {
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