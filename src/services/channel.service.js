import ChannelsRepository from "../repositories/channels.repository.js";


class ChannelService{
    static async getAllByWorkspaceId(workspace_id){
        return await ChannelsRepository.getAllByWorkspaceId(workspace_id)
    }

    static async create (workspace_id, name){
        await ChannelsRepository.create(workspace_id, name)
        return await ChannelsRepository.getAllByWorkspaceId(workspace_id)
    }
}

export default ChannelService