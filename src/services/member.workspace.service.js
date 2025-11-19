import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.config.js"
import MembersWorkspaceRepository from "../repositories/members.workspace.repository.js"
import { ServerError } from "../error.js"

class MemberWorkspaceService {
    static async confirmInvitation(invitation_token) {
        const invitation_token_decoded = jwt.verify(invitation_token, ENVIRONMENT.SECRET_JWT)
        const { id_invited, id_workspace, invited_role } = invitation_token_decoded

        const is_already_member = await MembersWorkspaceRepository.getByUserIdAndWorkspaceId(id_invited, id_workspace)
        if (is_already_member) {
            throw new ServerError(400, `${req.user.name} ya existe en el espacio de trabajo`)
        }

        await MembersWorkspaceRepository.createMember(id_invited, id_workspace, invited_role)
    }
}

export default MemberWorkspaceService