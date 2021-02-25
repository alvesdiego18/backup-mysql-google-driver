const nodemailer = require("nodemailer");
const logger = require(`perfect-logger`)

const sendMail = async (options) => {

    if (options.mail && options.mail.active) {

        try {
            
            const transporter = nodemailer.createTransport({
                host: options.mail.host,
                port: options.mail.port,
                secure: options.mail.secure ? options.mail.secure : true,
                auth: {
                    user: options.mail.user,
                    pass: options.mail.pass,
                },
            });

            await transporter.sendMail({
                from: options.mail.from,
                to: options.mail.to,
                subject: options.mail.subject ? options.mail.subject : "New backup performed successfully",
                text: options.mail.text ? options.mail.text : "New backup performed successfully",
            })

            logger.info(`mail notification send with success to => ${options.mail.to}.`)

        } catch (error) {

            logger.info('!## error to send mail notification. ##')
            logger.info(error.message)
            logger.info(error)
        }
    }
}

module.exports = {sendMail}