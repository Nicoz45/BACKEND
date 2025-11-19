import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.config.js"
import MembersWorkspaceRepository from "../repositories/members.workspace.repository.js"
import { ServerError } from "../error.js"
import MemberWorkspaceService from "../services/member.workspace.service.js"

class MemberController {
    static async confirmInvitation(req, res) {
        try {
            // Una vez que tenemos el token, lo decodificamos
            const { invitation_token } = req.params
            await MemberWorkspaceService.confirmInvitation(invitation_token)

            res.redirect(ENVIRONMENT.FRONTEND_URL + '/login')
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(400).json(
                    {
                        ok: false,
                        message: 'Token invalido',
                        status: 400
                    }
                )
            }
            else if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json(
                    {
                        ok: false,
                        message: 'Token expirado, vuelve a solivcitar la invitacion',
                        status: 401
                    }
                )
            }

            else if (error.status) {
                res.send(`<h1>${error.message}</h1>`)
            }
            else {
                console.error(error.message)
                res.send('<h1>Error interno en el servidor</h1>')
            }
        }
    }
}

export default MemberController