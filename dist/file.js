const fs = require("fs");
const { google } = require('googleapis');

function sendFile(fileName, filePath, callback) {
    require("./gdrive")((auth) => {

        const folderId = process.env.BACKUP_DRIVE_GOOGLE_FOLDER_ID

        const fileMetadata = {
            name: fileName,
            parents: [folderId]
        };

        const media = {
            mimeType: "[*/*]",
            body: fs.createReadStream(filePath)
        }

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
    });
}

function deleteFile(fileid, callback) {

    require("./gdrive")((auth) => {
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
    });
}

module.exports = {
    send: sendFile,
    delete: deleteFile
};