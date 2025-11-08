import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../error.js"
import AuthService from "../services/auth.services.js"

class AuthController{
    static async register (req, res){
        /*Estas validaciones se suelen hacer con librerias como "joi"*/
        console.log(req.body)
        try{
            const {email, name, password} = req.body
            await AuthService.register(email, name, password)
            res.status(201).json({
                ok: true,
                message: "Usuario registrado con exito"
            })
        }
        catch(error){
            /*
            Si es un error especifico (tiene status) entonces tirame un error especifico.
            Si es un error generico (no tiene status) entonces tirame un error generico.
            */
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
            console.log(error)
        }
    }

    static async verifyEmail(req, res){
        try{
            const { verification_token } = req.params
            await AuthService.verifyEmail(verification_token)
            res.redirect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING + '/login?from=verified_email')/* (ENVIRONMENT.FRONTEND_URL + '/login?from=verified_email') */
            /* res.json({
                ok: true,
                message: `Email verificado con exito`,
                status: 200
            }) */
        }
        catch(error){
            if(error.status){
                res.send(`<h1>${error.message}</h1>`)
                /* res.send({
                    ok: false,
                    message: error.message,
                    status: error.status
                }) */
            }
            else{
                console.error(error.message)
                res.send('<h1>Error interno en el servidor</h1>')
                /* res.send({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                }) */
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
}

export default AuthController