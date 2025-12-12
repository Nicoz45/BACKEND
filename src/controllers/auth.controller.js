import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../error.js"
import AuthService from "../services/auth.services.js"

class AuthController{
    static async register (req, res){
        try{
            const {email, name, password} = req.body
            await AuthService.register(email, name, password)
            res.status(201).json({
                ok: true,
                message: "Usuario registrado con exito"
            })
        }
        catch(error){
            if(error.status){
                res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                res.status(500).json({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                })
            }
        }
    }

    static async verifyEmail(req, res){
        try{
            const { verification_token } = req.params
            const result = await AuthService.verifyEmail(verification_token)
            if(!result.verified){
                throw new ServerError(400, 'El token de verificacion es invalido o ha expirado')
            }
            else{
                res.redirect(`${ENVIRONMENT.FRONTEND_URL_DEPLOY}/login?from=verified_email`)
            }
        }
        catch(error){
            if(error.status){
                res.send(`<h1>${error.message}</h1>`)
            }
            else{
                console.error(error.message)
                res.send('<h1>Error interno en el servidor</h1>')
            }
        }
    }

    static async login(req, res){
        try{
            const {email, password} = req.body
            const {auth_token} = await AuthService.login(email, password)
            return res.json({
                ok: true,
                message: 'Login exitoso',
                status: 200,
                body: {
                    auth_token: auth_token
                }
            })
        }
        catch(error){
            if(error.status){
                res.send(`<h1>${error.message}</h1>`)
                /* res.json({
                    ok: false,
                    message: error.message,
                    status: error.status
                }) */
            }
            else{
                console.error(error.message)
                res.send('<h1>Error interno en el servidor</h1>')
                /* res.json({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                }) */
            }
        }
    } //login

    static async forgotPassword(req, res){
        try {
            const {email} = req.body
            if(!email){
                throw new ServerError(400, 'El mail es requerido')
            }
            await AuthService.forgotPassword(email)
            res.status(200).json({
                ok: true,
                message: 'Email de recuperacion enviado exitosamente',
                status: 200
            })
        }
        catch(error){
            if(error.status){
                res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error(error.message)
                res.status(500).json({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                })
            }
        }
    }

    static async resetPassword(req, res){
        try {
            const {token} = req.params
            const {password} = req.body

            if(!password){
                throw new ServerError(400, 'La contraseña es requerida')
            }

            await AuthService.resetPassword(token, password)
            res.status(200).json({
                ok: true,
                message: 'Contraseña actualizada exitosamente',
                status: 200
            })
        } catch (error) {
            if(error.status){
                res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error(error.message)
                res.status(500).json({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                })
            }
        }
    }
}

export default AuthController