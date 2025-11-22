import jwt from "jsonwebtoken"
import { ServerError } from "../error.js"
import MembersWorkspaceRepository from "../repositories/members.workspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkSpaceRepository from "../repositories/workspace.repository.js"
import ENVIRONMENT from "../config/environment.config.js"
import mailTransporter from "../config/mailTransporter.config.js"

class WorkspaceService {
    static async getAll(user_id) {
        const members = await MembersWorkspaceRepository.getAllByUserId(user_id)
        console.log(members)
        return members
    }

    static async create(user_id, name, url_image) {
        console.log(user_id, name, url_image)
        //Crear el espacio de trabajo
        const workspace_created = await WorkSpaceRepository.createWorkspace(name, url_image)
        //Crear al miembro con rol de admin (creador del workspace)
        await MembersWorkspaceRepository.createMember(user_id, workspace_created._id, 'Admin')

        return workspace_created
    }

    static async invite(member, workspace_selected, email_invited, role_invited) {
        console.log(member, workspace_selected, email_invited, role_invited)
        const user_invited = await UserRepository.getByEmail(email_invited)
        console.log(user_invited)
        if(!user_invited){
            throw new ServerError(404, 'El usuario invitado no existe')
        }

        const already_member = await MembersWorkspaceRepository.getByUserIdAndWorkspaceId(user_invited._id, workspace_selected._id)
        if(already_member){
            throw new ServerError(400, `${member.name} ya existe en el espacio de trabajo`)
        }

        const invitation_token = jwt.sign(
            {
                id_invited: user_invited._id,
                id_inviter: member._id,
                id_workspace: workspace_selected._id,
                invited_role: role_invited
            },
            ENVIRONMENT.SECRET_JWT,
            {
                expiresIn: "7d"
            }
        )

        await mailTransporter.sendMail({
            to: email_invited,
            from: ENVIRONMENT.GMAIL_USER,
            subject: 'Te han invitado a un espacio de trabajo',
            html: `
                    <h1>Has sido invitado al workspace: ${workspace_selected.name}</h1>
                    <a href=${ENVIRONMENT.BACKEND_URL}/api/member/confirm/${invitation_token}>Aceptar</a>
            `
        })

    }

    static async updateById(workspace_id, update_workspace){
        try {
            await WorkSpaceRepository.updateById(workspace_id, update_workspace)
            const workspace_updated = WorkSpaceRepository.getById(workspace_id)
            return workspace_updated
        } catch (error) {
            console.error(error.message)
            throw new ServerError('Error')
        }
    }

    static async deleteById(workspace_id){
        try {
            await WorkSpaceRepository.deleteById(workspace_id)
            const workspace_deleted = WorkSpaceRepository.getById(workspace_id)
            return workspace_deleted
            
        } catch (error) {
            console.error(error.message)
            throw new ServerError('Error interno')
        }
    }
}

export default WorkspaceService