import MembersWorkspaceRepository from "../repositories/members.workspace.repository.js"
import WorkSpaceRepository from "../repositories/workspace.repository.js"

class WorkspaceService{
    static async getAll(user_id){
        const members = await MembersWorkspaceRepository.getAllByUserId(user_id)
        return members
    }
        }

export default WorkspaceService