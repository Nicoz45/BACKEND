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
        const user = await UserRepository.getByEmail(email)
        if (user) {
            throw new ServerError(400, "Email ya en uso")
        }
        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.create(name, email, password_hashed)
        const user_id_created = user_created._id
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
            const payload = jwt.verify(verification_token, ENVIRONMENT.SECRET_JWT) //Esto me va a dar el payload que firmamos al crear el token.
            const { user_id } = payload 
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
            await UserRepository.updateById(user_id, { verified_email: true })
            return
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Token invalido')
            }
            throw error
        }

    }

    static async login(email, password) {
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

        const auth_token = jwt.sign(
            {
                name: user_found.name,
                email: user_found.email,
                id: user_found.id
            },
            
            ENVIRONMENT.SECRET_JWT
        )
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
        return mail_send
    }

    static async resetPassword(token, new_password) {
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

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