import ChannelMessagesRepository from "../repositories/channel.messages.repository.js";

class MessageService {
    static async create(content, member_id, channel_id) {
        const message_created = await ChannelMessagesRepository.create(content, member_id, channel_id)
        const messages = await ChannelMessagesRepository.getAllByChannelId(channel_id)
        return {
            messages: messages,
            message_created: message_created
        }
    }

    static async getAllByChannelId(channel_id){
        const messages = await ChannelMessagesRepository.getAllByChannelId(channel_id)
        return {
            messages: messages
        }
    }
}

export default MessageService