import { ServerError } from "../error.js"
import MembersWorkspaceRepository from "../repositories/members.workspace.repository.js"
import WorkSpaceRepository from "../repositories/workspace.repository.js"

/* valid_member_roles, es basicamente el rol valido que tiene que tener un miembro para poder gestionar
    alguna accion, ya sea incorporar a un nuevo miebro al espacio de trabajo o eliminarlo o mandar mensajer
    etc. Por defecto va a ser un array vacio.
*/
/*
Este middleware lo que va a hacer lo siguiente:
- Checkear que el workspace con x ID exista
- Checkear si el cliente es un miembro de ese workspace
- Checkear si el miembro cuenta con el rol permitido
*/
function workspaceMiddleware(valid_member_roles = []) {
    return async function (req, res, next) {
        try {
            //Como yo se que me van a pasar el workspace_id, puedo obtenerlo:
            const { workspace_id } = req.params
            const user = req.user
            // Ya puedo hacer un chequeo:
            // - Checkear que el workspace con x ID exista
            const workspace_selected = await WorkSpaceRepository.getById(workspace_id)
            if (!workspace_selected) {
                throw new ServerError(404, 'Workspace no encontrado')
            }
            // - Checkear si el cliente es un miembro de ese workspace
            const member = await MembersWorkspaceRepository.getByUserIdAndWorkspaceId(user.id, workspace_id)
            if (!member) {
                throw new ServerError(403, 'No tienes acceso a este espacio de trabajo.')
            }

            // - Checkear si el miembro cuenta con el rol permitido
            if (valid_member_roles > 0 && !valid_member_roles.includes(member.role)) {
                throw new ServerError(403, 'No puedes hacer esta operacion')
            }

            //Guardamos en la request los datos del miembro
            req.member = member

            //Guardamos en la request los datos del workspace
            req.workspace_selected = workspace_selected

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
                console.error('ERROR en workspaceMiddleware', error)
                return res.status(500).json({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                })
            }
        }

    }
}

export default workspaceMiddleware


/*
Reglas:
    - Todos los middlewares deben recibir a request, response y next
*/

/*
Esto seria un wrapper:
Es un codigo que envuelve a otra pieza de codigo, sistema o dato para modificar,
extender o controlar su comportamiento.
En este caso estamos cambiando el comportamiento del middleware.
En vez de que solo trabaje con la request, response y el next, la encerramos en otra funcion
a la que le podamos pasar los parametros que deseemos configurar y que esta nos retorne
la funcion con la request, response y next.
*/