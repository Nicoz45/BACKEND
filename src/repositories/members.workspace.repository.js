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
            const all_members = await WorkspaceMembers.find({active: true})
            console.log(all_members)
            return all_members
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo obtener un listado de miembros', error)
            throw error
        }
    }

    static async getById(members_id){
        try{
            const member_found = await WorkspaceMembers.findById(members_id)
            console.log(member_found)
            return member_found
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo obtener al miembro', error)
            throw error
        }
    }

    static async deleteById(members_id){
        try{
            await WorkspaceMembers.findByIdAndDelete(members_id)
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo eliminar al miembro', error)
            throw error
        }
    }

    static async updateById(members_id, update_member){
        try{
            await WorkspaceMembers.findByIdAndUpdate(members_id, update_member)
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo actualizar la informacion del miembro', error)
            throw error
        }
    }

    static async getAllByUserId(user_id){
        const members = await WorkspaceMembers.find({id_user: user_id, active: true}).populate('id_workspace')

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
            return members_list_formatted
    }
}

export default MembersWorkspaceRepository