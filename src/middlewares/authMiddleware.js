import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../error.js"
import jwt from "jsonwebtoken"

function authMiddleware(req, res, next) {
    try {
        const auth_header = req.headers.authorization
        if(!auth_header){
            throw new ServerError(401, 'No hay header de sesion')
        }
        const auth_token = auth_header.split(' ')[1]
        if(!auth_token){
            throw new ServerError(401, 'No hay token de sesion')
        }
        const user_session_data = jwt.verify(auth_token, ENVIRONMENT.SECRET_JWT)

        //HOT POINT: Guardamos los datos del token dentro de la request
        req.user = user_session_data
        next()
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            res.status(400).json(
                {
                    ok: false,
                    message: 'Token invalido',
                    status: 400
                }
            )
        } 
        else if(error instanceof jwt.TokenExpiredError){
            res.status(401).json(
                {
                    ok: false,
                    message: 'Token expirado',
                    status: 401
                }
            )
        }
        else if(error.status){
            return res.status(error.status).json(
                {
                    ok: false,
                    message: error.message,
                    status: error.status
                }
            )
        }
        else{
            console.error('ERROR AL OBTENER EL TOKEN', error)
            return res.status(500).json({
                ok: false,
                message: 'Error interno en el servidor',
                status: 500
            })
        }
    }
}

export default authMiddleware
