import MembersWorkspaceRepository from "../repositories/members.workspace.repository.js"
import WorkSpaceRepository from "../repositories/workspace.repository.js"

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
}

export default WorkspaceService