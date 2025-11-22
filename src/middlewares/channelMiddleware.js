import { ServerError } from "../error"
import ChannelsRepository from "../repositories/channels.repository"

async function channelMiddleware(req, res, next) {
    try {
        const { workspace_selected, member, user } = req
        const { workspace_id, channel_id } = req.params
        const channel_selected = await ChannelsRepository.getByIdAndWorkspaceId(workspace_id ,channel_id)
        if (!channel_selected) {
            throw new ServerError(404, 'Canal no encontrado')
        }
        req.channel_selected = channel_selected
        next()
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json(
                {
                    ok: false,
                    message: error.message,
                    status: error.status
                }
            )
        }
        else {
            return res.status(500).json({
                ok: false,
                message: 'Error interno en el servidor',
                status: 500
            })
        }
    }
}
    