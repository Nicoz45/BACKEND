import ChannelMessages from "../models/Channel.messages.model.js";

class ChannelMessagesRepository {
    static async create(channels_id, sender_member_id){
        try{
            await ChannelMessages.insertOne({
                channels_id: channels_id,
                sender_member_id: sender_member_id
            })
            console.log('[SERVER]: Mensaje enviado con exito.')
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
}

export default ChannelMessagesRepository