import ChannelMessages from "../models/Channel.messages.model.js";

class ChannelMessagesRepository {
    static async create(content, channel_id, sender_member_id){
        try{
            const message_created = await ChannelMessages.insertOne({
                channel_id: channel_id,
                sender_member_id: sender_member_id,
                content: content,
            })
            console.log('[SERVER]: Mensaje enviado con exito.')
            return message_created
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo enviar el mensaje ', error)
        }
    }

    static async getAll(){
        try{
            const messages_channels_list = await ChannelMessages.find() 
            return messages_channels_list
        } 
        catch(error){
            console.error('[SERVER ERROR]: No se enconto una lista de canales ', error)
            throw error
        }
    }

    static async getById(channel_messages_id){
        try{
            const message_channel_found = await ChannelMessages.find(channel_messages_id)
            return message_channel_found
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo encontrar el mensaje solicitado ', error)
            throw error
        }
    }

    static async deleteById(channel_messages_id){
        try{
            await ChannelMessages.findByIdAndDelete(channel_messages_id)
        }
        catch(error){
            console.error('[SERVER ERROR]: No se encontro el mensaje solicitado para eliminar ', error)
        }
    }

    static async updateById(channel_messages_id, update_message){
        try{
            await ChannelMessages.findByIdAndUpdate(channel_messages_id, update_message)
        }
        catch(error){
            console.error('[SERVER ERROR]: No se pudo actualizar los datos solicitados ', error)
            throw error
        }
    }

    static async getAllByChannelId(channel_id){
        const messages = await ChannelMessages.find({channel_id: channel_id})
        .populate({
            path: 'sender_member_id',
            populate: {
                path: 'id_user',
                model: 'User',
                select: 'name_id'
            }
        })

        const messages_formated = messages.map(
            (message) => {
                return {
                    _id: message._id,
                    messae_content: message.content,
                    member_id: message.sender_member_id._id,
                    user_name: message.sender_member_id.id_user.name
                }
            }
        )
        return messages_formated
    }
}

export default ChannelMessagesRepository