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
}

export default ChannelController