import WorkSpaceRepository from "../repositories/workspace.repository.js"
import workspaceRouter from "../routes/workspace.router.js"
import WorkspaceService from "../services/workspace.service.js"

class WorkspaceController {
    static async getAll(req, res) {
        try {
            const user = req.user
            const workspaces = await WorkspaceService.getAll(user.id)
            console.log(req.user)
            const data = res.status(200).json({
                ok: true,
                status: 200,
                message: "Lista de workspaces obtenida correctamente",
                data: {
                    workspaces: workspaces
                }
            })
            console.log(workspaces)
            console.log(data.workspaces)
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

    static async create(req, res) {
        try{
            const user = req.user
            const {name, url_image} = req.body

            const workspace_created = await WorkspaceService.create(user.id, name, url_image) 
            res.status(201).json(
                {
                    status: 201,
                    ok: true,
                    message: 'Espacio de trabajo creado con exito',
                    data: {
                        workspace: workspace_created
                    }
                }
            )
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
