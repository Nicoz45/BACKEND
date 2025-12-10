import ChannelService from "../services/channel.service.js"


class ChannelController{
    static async create(req, res){
        try {
            const {workspace_selected} = req
            const {name} = req.body
            if(!name){
                return res.status(400).json({
                    ok: false,
                    message: 'El nombre del canal es requerido',
                })
            }
            //Crear el canal usando .createChannel
            const channel_list = await ChannelService.create(workspace_selected._id, name)
            res.status(201).json({
                ok:true,
                message: 'Canal creado',
                status: 201,
                data: {
                    channels: channel_list
                }
            })

        } catch (error) {
            console.error('Error al crear:', error)
            res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    }

    static async deleteById(req, res){
        try {
            const {channel_selected, workspace_selected} = req
            const channel_deleted = await ChannelService.deleteById(channel_selected._id, workspace_selected._id)
            return res.status(200).json({
                ok: true,
                message: 'Canal eliminado correctamente',
                status: 200
            })
        } catch (error) {
            console.error('Error al eliminar:', error)
            
            if(error.status){
                return res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }

            res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    }

    static async updateById(req, res){
        try {
            const {channel_selected, workspace_selected} = req
            const {name} = req.body

            if(!name){
                return res.status(400).json({
                    ok: false,
                    message: 'El nombre del canal es requerido',
                })
            }

            const channel_updated = await ChannelService.updateById(channel_selected._id, name)
            return res.status(200).json({
                ok: true,
                message: 'Canal actualizado correctamente',
                status: 200,
                data: {
                    channel: channel_updated
                }
            })
        } catch (error) {
            console.error('Error al actualizar:', error)
            if(error.status){
                return res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    }
}

export default ChannelController