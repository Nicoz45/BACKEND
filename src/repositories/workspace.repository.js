import Workspace from "../models/WorkSpace.model.js"

class WorkSpaceRepository {
    static async createWorkspace(name, url_image) {
        try {
            return await Workspace.insertOne({
                name: name,
                url_image: url_image
            })
            console.log('[SERVER]: Workspace creado con exito')
        }
        catch (error) {
            console.error('[SERVER ERROR]: Hubo un fallo al crear el espacio de trabajo ', error)
            throw error
        }
    }

    static async getAll() {
        try {
            const workspaces_found = await Workspace.find({ active: true })
            console.log(workspaces_found)
            return workspaces_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener el listado de los espacios de trabajo', error)
            throw error
        }
    }

    static async getById(workspace_id) {
        try {
            const workspace_by_id = await Workspace.findById(workspace_id)
            console.log(workspace_by_id)
            return workspace_by_id
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo encontrar el espacio de trabajo solicitado', error)
            throw error
        }
    }

    static async deleteById(workspace_id){
        try{
            await Workspace.findByIdAndDelete(workspace_id)
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo eliminar el espacio de trabajo', error)
            throw error
        }
    }

    static async updateById(workspace_id, update_workspace){
        try{
            await Workspace.findByIdAndUpdate(workspace_id, update_workspace)
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo actualizar el espacio de trabajo', error)
            throw error
        }
    }
}

export default WorkSpaceRepository
