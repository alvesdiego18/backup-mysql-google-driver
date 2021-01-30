# backup-mysql-google-driver
This library will help you to perform backups of the mysql database and send them to the google drive

## Custom your backup mysql and save in Google drive
> This is just a bunch of encapsulated libraries to make it easier to back up the database and to store it in the cloud with more comfort and practicality. see below how you can customize.

## backup
| Props | Value Type | Description | Default | Required |
|--|--|--|--|--|
| host | string | host from mysql database | - | true |
| user | string | root name mysql database | - | true |
| password | string | password mysql database | - | true |
| keep_files | number | number of backups that will be kept | 10 | false |
| folder_backups | string | name folder to create and save all backup | ./backup | false |

## Cron
> Use this link https://crontab.guru/ from generated a time cron running 

| Props | Value Type | Description | Default | Required |     
|--|--|--|--|--|
| active | bool | enable the cron | false | true |
| time | string | time the cron running | */2 * * * * | true |
| timezone | string | timezone the cron | America/Sao_Paulo | true |


## Google Drive
> See how to configure this step below api google drive
### Configure Google drive
> Use this link https://developers.google.com/drive/api/v3/quickstart/nodejs to enable google drive api and get your client_id and client_secret

| Props | Value Type | Description | Default | Required |
|--|--|--|--|--|
| active | bool | enable the google drive | false | true |
| client_id | string | the client key id | - | true |
| client_secret | string | the client key secret | - | true |
| folder_id | string | the id folder | - | false |


## Mail
| Props | Value Type | Description | Default | Required |
|--|--|--|--|--|
| active | bool | enable sending notification mail | false | true |
| host | string | host to send mail | - | true |
| port | number | port to send mail | - | true |
| secure | bool | secure to send mail | - | true |
| user | string | user to send mail | - | true |
| pass | string | password to send mail  | - | true |
| from | string | email from send mail | - | true |
| to | string | email to send mail  | - | true |
| subject | string | subject to send mail | New backup performed successfully | false |
| text | string | text to send mail | New backup performed successfully | false |

# What are you doing
- [x] Backup Database Mysql 
- [x] Dinamic login with Google driver
- [x] Send backup file to Google Driver
- [x] Limited backup files upload 
- [x] Delete files localy and google driver
- [x] Limited files in Google driver 
- [x] Generated log control
- [x] Send email alert
- [x] Cron Dinamic

## Install
> yarn add backup-mysql-google-driver

## Usage :

```js
const monitor_backup = require('backup-mysql-google-driver')

monitor_backup({

    backup: {
        host: '',
        user: '',
        password: '',
        database: '',
        keep_files: 10,
    },

    cron: {
        active: false,
        time: `*/10 * * * *`,
        timezone: `America/Sao_Paulo`,
    },

    google_drive: {
        active: false,
        client_id: '',
        client_secret: '',
        folder_id: '',
    },

    mail: {
        active: false,
        host: '',
        port: 465,
        secure: true,        
        user: '',
        pass: '',

        from: 'Name <email@email.com>',
        to: '',
        subject: '',
        text: '',
    }
})
```