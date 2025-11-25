import MessageService from "../services/messages.service.js"

class MessagesController {
    static async getAllByChannelId(req, res){
        try {
            const {channel_selected, member} = req
            const {content} = req.body
            const {messages} = await MessageService.getAllByChannelId(content, channel_selected._id)
            response.status(200).json({
                ok: true,
                status: 200,
                message: "Messages",
                data: {
                    messages: messages
                }
            })
        } catch (error) {
            if(error.status){
                return res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            console.error('ERROR AL REGISTRAR', error)
            return res.status(500).json({
                ok: false,
                message: 'Error interno en el servidor',
                status: 500
            })
        }
    }

    static async create(req, res){
        try {
            const {channel_selected, member, user} = req
            const {content} = req.body
            const {messages, message_created} = await MessageService.create(content, member._id, channel_selected._id)
            console.log('MESSAGE CREATED:', message_created)
            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'Messages created',
                data: {
                    messages: messages,
                    message_created: message_created
                }
            })
        } catch (error) {
            if(error.status){
                return res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error('ERROR SL REGISTRAR', error)
                return res.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }
}

export default MessagesController