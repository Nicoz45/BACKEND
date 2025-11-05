import WorkSpaceRepository from "../repositories/workspace.repository.js"
import workspaceRouter from "../routes/workspace.router.js"

class WorkspaceController {
    static async getAll(req, res) {
        const workspaces = await WorkSpaceRepository.getAll()

        res.send(
            {
                workspaces: workspaces
            })
    }
}

export default WorkspaceController
