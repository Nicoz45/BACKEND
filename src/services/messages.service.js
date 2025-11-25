import ChannelMessagesRepository from "../repositories/channel.messages.repository.js";

class MessageService {
    static async create(content, channel_id, member_id) {
        const message_created = await ChannelMessagesRepository.create(content, channel_id, member_id)
        const messages = await ChannelMessagesRepository.getAllByChannelId(channel_id)
        console.log('MESSAGES SERVICE:', messages)
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