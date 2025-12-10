import ChannelsRepository from "../repositories/channels.repository.js";


class ChannelService {
    static async getAllByWorkspaceId(workspace_id) {
        return await ChannelsRepository.getAllByWorkspaceId(workspace_id)
    }

    static async create(workspace_id, name) {
        await ChannelsRepository.create(workspace_id, name)
        return await ChannelsRepository.getAllByWorkspaceId(workspace_id)
    }
    static async deleteById(channel_id){
        await ChannelsRepository.deleteById(channel_id)
        return await ChannelsRepository.getAll()
    }

    static async updateById(channel_id){
        await ChannelsRepository.updateById(channel_id)
        return await ChannelsRepository.getAll()
    }
}


export default ChannelService