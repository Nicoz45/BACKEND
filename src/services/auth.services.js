import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../error.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/User.model.js";
import crypto from "crypto"

class AuthService {
    static async register(email, name, password) {
        console.log(email, name, password)
        const user = await UserRepository.getByEmail(email)
        if (user) {
            throw new ServerError(400, "Email ya en uso")
        }
        //De esta manera hasheamos el password.
        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.create(name, email, password_hashed)
        const user_id_created = user_created._id

        //Creamos un Json Web Token (JWT) para verificar el email del usuario.
        //Un json web token es un objeto pasado a texto con una firma (signature)
        //Un Json web token es un token que contiene informacion codificada (puede ser el id del usuario, su email, etc)
        //Vamos a enviar este JWT por URL, en vez de enviar el email plano del usuario.

        // .sign() nos permite firmar un token
        // Primer parametro: La informacion que queremos codificar dentro del token (payload)
        // Segundo parametro: Una clave secreta que solo el servidor conoce y que sirve para firmar el token.
        // Tercer parametro: Opciones adicionales como tiempo de expiracion, algoritmo de firma, etc.
        // Lo ideal es que esta clave secreta este en una variable de entorno y no hardcodeada.
        const verification_token = jwt.sign(
            { user_id: user_id_created },
            ENVIRONMENT.SECRET_JWT)

        await mailTransporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta de mail',
            html: `
                <h1>Verifica tu cuenta de mail</h1>
                <a href="${ENVIRONMENT.BACKEND_URL}/api/auth/verify-email/${verification_token}">Verificar</a>
            `
        })
        return
    }

    static async verifyEmail(verification_token) {
        try {
            //Esto nos dice si el token esta firmado con x clave.
            const payload = jwt.verify(verification_token, ENVIRONMENT.SECRET_JWT) //Esto me va a dar el payload que firmamos al crear el token.
            const { user_id } = payload //Sacamos el email del payload.
            // Puedo verificar que el email exista en la base de datos.
            if (!user_id) {
                throw new ServerError(400, 'Token invalido: token con datos insuficientes')
            }
            const user_found = await UserRepository.getById(user_id)
            if (!user_found) {
                throw new ServerError(404, 'Usuario no encontrado para el token proporcionado')
            }
            if (user_found.verified_email) {
                throw new ServerError(400, 'El email ya fue verificado previamente')
            }
            //El siguiente paso seria buscarlo por email en la base de datos y marcar su email como verificado.
            //Podemos pasar el id del usuario por el token.
            //Ahora si lo actualizamos por id.
            await UserRepository.updateById(user_id, { verified_email: true })
            return
        }
        catch (error) {
            //Chequeamos si el error es de la verificacion del token.
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Token invalido')
            }
            throw error
        }

    }

    static async login(email, password) {
        /*logica:
        - Buscar al usuario por email
        - Validar que exista
        - Verificar que este verificado su mail
        - Comparar la password recibida con la del usuario
        - Genera un token con datos de sesion del usuario y responderlo
        */
        const user_found = await UserRepository.getByEmail(email)
        if (!user_found) {
            throw new ServerError(404, 'Usuario inexistente')
        }
        if (!user_found.verified_email) {
            throw new ServerError(401, 'Usuario con mail no verificado')
        }
        const is_same_password = await bcrypt.compare(password, user_found.password)
        if (!is_same_password) {
            throw new ServerError(401, 'Credenciales invalidas')
        }

        //Creo un token con datos de sesion del usuario (DATOS NO SENSIBLES)
        const auth_token = jwt.sign(
            {
                name: user_found.name,
                email: user_found.email,
                id: user_found.id
            },
            //Lo firmamos
            ENVIRONMENT.SECRET_JWT
        )
        //Devolvemos el token
        return {
            auth_token: auth_token
        }
    }

    static async forgotPassword(email) {
        const user = await UserRepository.getByEmail(email)
        if (!user) {
            throw new ServerError(404, 'Usuario no encontrado')
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        console.log('Reset Token (enviado por mail): ', resetToken)
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        await UserRepository.updateById(user._id,
            {
                resetPasswordToken: resetTokenHash,
                resetPasswordExpires: Date.now() + 3600000
            })

        const resetUrl = `${ENVIRONMENT.FRONTEND_URL}/reset-password/${resetToken}`
        console.log(resetUrl)

        const mail_send = await mailTransporter.sendMail({
            to: email,
            from: ENVIRONMENT.GMAIL_USER,
            subject: 'Reseteo de contraseña',
            html: `
                <h1>Solicitud de reseteo de contraseña</h1>
                <p>Has solicitado resetear tu contraseña.</p>
                <p>Haz click en este link para continuar:</p>
                <a href="${resetUrl}">Resetear-contraseña</a>
                <p>Este link expira en 1 hora.</p>
                <p>Si no solicitaste este cambio, ignora este mail.</p>
            `
        })
        console.log(mail_send)
        return mail_send
    }

    static async resetPassword(token, new_password) {
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

            console.log(resetTokenHash)
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) {
            throw new ServerError(400, 'Token invalido o expirado')
        }
        const password_hashed = await bcrypt.hash(new_password, 12)

        await UserRepository.updateById(user._id,
            {
                password: password_hashed,
                resetPasswordToken: null,
                resetPasswordExpires: null
            })
        return
    }
}

export default AuthService