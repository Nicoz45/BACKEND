import WorkSpaceRepository from "../repositories/workspace.repository.js"
import workspaceRouter from "../routes/workspace.router.js"
import WorkspaceService from "../services/workspace.service.js"

class WorkspaceController {
    static async getAll(req, res) {
        try {
            /* const user = req.user
            const workspaces = await WorkspaceService.getAll(user.id) */
            res.status(200).json({
                ok: true,
                status: 200,
                message: "Lista de workspaces obtenida correctamente",
                data: {
                    workspaces: workspaces
                }
            })
        }
        catch (error) {
            if (error.status) {
                res.send(`<h1>${error.message}</h1>`)
            }
            else {
                console.error(error.message)
                res.send('<h1>Error interno en el servidor</h1>')
            }

        }
    }
}
export default WorkspaceController
