import express from 'express';
import WorkspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import workspaceMiddleware from '../middlewares/workspaceMiddleware.js';
import ChannelController from '../controllers/channel.controller.js';
import channelMiddleware from '../middlewares/channelMiddleware.js';
import MessagesController from '../controllers/messages.controller.js';

const workspaceRouter = express.Router()

/* workspaceRouter.get('/all', WorkspaceController.getAll) */

//Obtener la lista de espacios de trabajo DEL CLIENTE QUE ME ESTA CONSULTANDO.
workspaceRouter.get('/',
    authMiddleware,
    WorkspaceController.getAll)

workspaceRouter.post('/',
    authMiddleware,
    WorkspaceController.create
)

workspaceRouter.get(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(),
    WorkspaceController.getById
)

workspaceRouter.put(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.updateById
)

workspaceRouter.delete(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.deleteById
)

workspaceRouter.post(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']),
    ChannelController.create
)

workspaceRouter.put(
    '/:workspace_id/channels/:channel_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    channelMiddleware,
    ChannelController.updateById
)

workspaceRouter.delete(
    '/:workspace_id/channels/:channel_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    channelMiddleware,
    ChannelController.deleteById
)

workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.getAllByChannelId
)

workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.create
)

workspaceRouter.post('/:workspace_id/invite',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.invite
)

export default workspaceRouter