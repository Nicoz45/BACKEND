import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.GMAIL_USER,
        pass: ENVIRONMENT.GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false //Ignoramos validaciones de certificado TLS.
    }
})

mailTransporter.verify((error, success) => {
    if (error) {
        console.error('[SERVER ERROR]: No se pudo conectar con el servicio de mail', error)
    } else {
        console.log('[SERVER]: Conectado al servicio de mail correctamente')
    }
})  

export default mailTransporter