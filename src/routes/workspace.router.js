import express from 'express';
import WorkspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import workspaceMiddleware from '../middlewares/workspaceMiddleware.js';
import ChannelController from '../controllers/channel.controller.js';

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
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(),
    WorkspaceController.getById
)

workspaceRouter.put(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.updateById
)

workspaceRouter.delete(
    '/:workspace_id',
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

workspaceRouter.get('/:workspace_id/test',
    authMiddleware,
    workspaceMiddleware(['admin']),
    (req, res) => {
        console.log(req.workspace_selected)
        console.log(req.member)
        res.json({
            ok: true,
            status: 200,
            message: 'test'
        })
    }
    /*
    Lo que estoy haciendo aca es que solamente el administrador pueda hacerme una consulta a /test
    */
)

workspaceRouter.post('/:workspace_id/invite',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.invite
)

export default workspaceRouter