require('dotenv').config()
const mysqldump = require('mysqldump')
const fs = require('fs')

async function init() {

    const result = await mysqldump({
        connection: {
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
        },        
    });

    if (fs.existsSync(process.env.DUMP_FILE))
        fs.unlinkSync(process.env.DUMP_FILE)

    if (result)
        console.log(result)
}

init()