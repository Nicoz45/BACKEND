import { ServerError } from "../error.js"
import UserRepository from "../repositories/user.repository.js"
import WorkSpaceRepository from "../repositories/workspace.repository.js"
import workspaceRouter from "../routes/workspace.router.js"
import ChannelService from "../services/channel.service.js"
import WorkspaceService from "../services/workspace.service.js"

class WorkspaceController {
    static async getAll(req, res) {
        try {
            const userId = req.user._id
            const user = await UserRepository.getById(userId)
            const workspaces = await WorkspaceService.getAll(user)
            console.log(workspaces)
            /* console.log(req) */
            const data = res.status(200).json({
                ok: true,
                status: 200,
                message: "Lista de workspaces obtenida correctamente",
                data: {
                    workspaces: workspaces
                }
            })
            console.log(data.workspaces)
        }
        catch (error) {
            console.log(error)
            if (error.status) {
                res.send(`<h1>${error.message}</h1>`)
            }
            else {
                console.log(error.message)
                res.send('<h1>Error interno en el servidor</h1>')
            }

        }
    }

    static async create(req, res) {
        try {
            const user = req.user
            const { name, url_image } = req.body

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

    static async invite(req, res) {
        try {
            const { member, workspace_selected, user } = req
            const { email_invited, role_invited } = req.body
            await WorkspaceService.invite(member, workspace_selected, email_invited, role_invited)
            res.json({
                status: 200,
                message: 'Invitacion enviada',
                ok: true
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

    static async getById(req, res) {
        try {
            const { workspace_selected, member, user } = req
            const channels = await ChannelService.getAllByWorkspaceId(workspace_selected._id)
            res.json({
                ok: true,
                status: 200,
                message: 'Espacio de trabajo obtenido',
                data: {
                    workspace_detail: workspace_selected,
                    channels: channels
                }
            })
        } catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR AL obtener detalles del workspace', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async updateById(req, res) {
        try {
            const { workspace_id } = req.params
            const { name, url_image } = req.body
            const update_workspace = { name, url_image }
            const workspace_updated = await WorkspaceService.updateById(workspace_id, update_workspace)
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Workspace actualizado correctamente',
                data: {
                    workspace: workspace_updated
                }
            })
        } catch (error) {
            if (error.status) {
                res.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                })
            }
            else {
                console.error(error.message)
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Error interno en el servidor'
                })
            }
        }
    }

    static async deleteById(req, res) {
        try {
            const { workspace_id } = req.params
            const workspace_deleted = await WorkspaceService.deleteById(workspace_id)
            res.status(200).json({
                ok: true,
                status: 200,
                message: `Espacio de trabajo ha sido eliminado`,
                data: {
                    workspace: workspace_deleted
                }
            })
        } catch (error) {
            if (error.status) {
                res.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                })
            }
            else {
                console.error(error.message)
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Error interno en el servidor'
                })
            }
        }
    }
}


export default WorkspaceController
