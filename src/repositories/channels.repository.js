import Channels from "../models/Channels.model.js";

class ChannelsRepository {
    static async create(id_workspaces, name) {
        try {
            const new_channel =await Channels.create({
                id_workspaces: id_workspaces,
                name: name
            })
            return new_channel
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo crear el canal ', error)
            throw error
        }
    }

    static async getAll() {
        try {
            const all_channels = await Channels.find({ active: true })
            return all_channels
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener una listado de canales', error)
            throw error
        }
    }

    static async getAllByWorkspaceId(workspace_id) {
        try {
            const found_channels = await Channels.find({ id_workspaces: workspace_id })
            return found_channels
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async getById(channels_id) {
        try {
            const channel_found = await Channels.findById(channels_id)
            return channel_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener el canal', error)
            throw error
        }
    }

    static async deleteById(channel_id) {
        try {
            await Channels.findByIdAndDelete(channel_id)
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo eliminar el canal', error)
            throw error
        }
    }

    static async updateById(channel_id) {
        try {
            const channel_updated =await Channels.findByIdAndUpdate(channel_id)
            return channel_updated
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo actualizar la informacion del canal ', error)
            throw error
        }
    }

    static async getByIdAndWorkspaceId(workspace_id, channel_id){
        try {
            const found_channel = await Channels.findOne({id_workspaces: workspace_id, _id: channel_id})
            return found_channel
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export default ChannelsRepository