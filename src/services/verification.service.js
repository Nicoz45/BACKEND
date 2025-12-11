import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../error.js";
import UserRepository from "../repositories/user.repository.js";
import crypto from "crypto"

class verificationService {
    static async sendVerificationCode(user_id) {
        const user = await UserRepository.getById(user_id)
        if (!user) {
            throw new ServerError(404, 'Usuario no encontrado')
        }

        const verification_code = crypto.randomBytes(3).toString('hex').toUpperCase()

        const code_expiration = Date.now() + 10 * 60 * 1000

        await UserRepository.updateById(user_id, {
            verificationCode: verification_code,
            verificationCodeExpiration: code_expiration
        })

        await mailTransporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: user.email,
            subject: 'Codigo de verificacion - Crear Workspace',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #611f69;">Código de Verificación</h1>
                    <p>Has solicitado crear un nuevo espacio de trabajo en Slack.</p>
                    <p>Tu código de verificación es:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #611f69; border-radius: 8px; margin: 20px 0;">
                        ${verification_code}
                    </div>
                    <p style="color: #666;">Este código expirará en 10 minutos.</p>
                    <p style="color: #666;">Si no solicitaste este código, puedes ignorar este correo.</p>
                </div>
            `
        })

        return {message: 'Codigo de verificacion enviado'}
    }

    static async verifyCode(user_id, code){
        const user = await UserRepository.getById(user_id)
        if(!user){
            throw new ServerError(404, 'Usuario no encontrado')
        }

        if(!user.verificationCode){
            throw new ServerError(400, 'No hay codigo de verificacion')
        }

        if(user.verificationCodeExpiration < Date.now()){
            await UserRepository.updateById(user_id, {
                verificationCode: null,
                verificationCodeExpiration: null
            })
            throw new ServerError(400, 'Codigo de verificacion expirado')
        }

        if(user.verificationCode !== code.toUpperCase()){
            throw new ServerError(400 , 'Codigo de verificacion incorrecto')
        }

        await UserRepository.updateById(user_id, {
            verificationCode: null,
            verificationCodeExpiration: null
        })
        return{message: 'Codigo verificado exitosamente', verified: true}
    }
}

export default verificationService