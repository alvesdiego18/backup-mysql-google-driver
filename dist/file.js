const fs = require("fs");
const { google } = require('googleapis');
const logger = require(`perfect-logger`)

const callGDriveApi = require(`./gdrive`)

function sendFile(fileName, filePath, options, callback) {

    callGDriveApi(options, (auth) => {

        const folderId = options.google_drive_folder_id

        const fileMetadata = {
            name: fileName,
            parents: [folderId]
        };

        const media = {
            mimeType: "[*/*]",
            body: fs.createReadStream(filePath)
        }

        logger.info(`sending new backup to google drive`)
        const drive = google.drive({ version: 'v3', auth });

        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        }, function (err, file) {

            if (err) {
                callback(err)
            } else {
                callback(file.data.id);
            }
        });
    })
}

function deleteFile(options, fileid, callback) {

    logger.info(`deleting old backups from google drive`)

    callGDriveApi(options, (auth) => {
        const drive = google.drive({ version: 'v3', auth });
        drive.files.delete({
            fileId: fileid
        }, function (err) {
            if (err) {
                callback(err);
            } else {
                callback('OK');
            }
        })
    })
}

module.exports = {
    send: sendFile,
    delete: deleteFile
};