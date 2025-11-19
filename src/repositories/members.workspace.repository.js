import WorkspaceMembers from "../models/Workspace.members.models.js"

class MembersWorkspaceRepository {
    static async createMember(id_user, id_workspace, role) {
        try {
            await WorkspaceMembers.insertOne({
                id_user: id_user,
                id_workspace: id_workspace,
                role: role
            })
            console.log('[SERVER]: Miembro agregado con exito')
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo agregar al miembro ', error)
            throw error
        }
    }

    static async getAll(){
        try{
            const member_workspaces = await WorkspaceMembers.find()
            console.log(all_members)
            return member_workspaces
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo obtener un listado de miembros', error)
            throw error
        }
    }

    static async getById(member_id){
        try{
            const member_found = await WorkspaceMembers.findById(member_id)
            console.log(member_found)
            return member_found
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo obtener al miembro', error)
            throw error
        }
    }

    static async deleteById(member_id){
        try{
            const member_workspace_deleted = await WorkspaceMembers.findByIdAndDelete(member_id)
            return member_workspace_deleted
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo eliminar al miembro', error)
            throw error
        }
    }

    static async updateById(member_id, update_member){
        try{
            const update =await WorkspaceMembers.findByIdAndUpdate(member_id, update_member)
            return update
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo actualizar la informacion del miembro', error)
            throw error
        }
    }

    static async getAllByUserId(user_id){
        //.populate nos permite expandir los datos de una referencia.
        const members = await WorkspaceMembers.find({id_user: user_id}).populate('id_workspace')

        /*Esto lo hacemos para dar formato a la respuesta, ya que mongoose mos da los datos pero desordenados */
        const members_list_formatted = members.map(
            (member)=>{
                return{
                    workspace_id: member.id_workspace._id,
                    workspace_name: member.id_workspace.name,
                    workspace_created_at: member.id_workspace.created_at,
                    workspace_url_image: member.id_workspace.url_image,
                    member_id: member._id,
                    member_user_id: member.id_user,
                    member_role: member.role,
                }
            }) 
            console.log(members_list_formatted)
            return members_list_formatted
        }

        static async getByUserIdAndWorkspaceId(user_id, workspace_id){
            const member = await WorkspaceMembers.findOne({id_user: user_id, id_workspace: workspace_id})
            return member
        }
}



export default MembersWorkspaceRepository