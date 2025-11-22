### CLASE 20
Para desplegar mi backend hecha en mongodb vamos a mongoDB Atlas en el navegador.
- Iniciamos sesion 
- Vamos a Database Acces
- Seleccionamos *Add new database user*
- Le ponemos un nombre y generamos una contraseña.
- Este nombre y contraseña las guardamos en nuesto .env
        MONGO_DB_PASSWORD=XEEq4k8cauQd4aSz
        MONGO_DB_USER=API_SLACK_TM_UTN
- Nos fijamos que ambas direcciones ip esten activas para que vercel pueda acceder y hacer consultas.
- Nos dirigimos a cluster en mongo atlas y seleccionamos la opcion de connect
- Elegimos la opcion de Compass
- Nos copiamos el connection string y lo pegamos en nuestro .env
        MONGO_DB_CONNECTION_STRING=mongodb+srv://<db_username>:<db_password>@cluster0.njx7nc1.mongodb.net/
- Copiamos y pegamos la contraseña y el usuario donde nos lo indica

- Ahora pasamos a modificar la configuracion del environment en environment.config.js
- Djeamos de usar --->  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
                        MONGO_DB_HOST: process.env.MONGO_DB_HOST,
- Y configuramos el connection string:
                        MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING

- Y este connection string lo tenemos que pasar a la configuracion de MongoDB, por lo tanto:
                        const connection_string = ENVIRONMENT.MONGO_DB_CONNECTION_STRING

- MUY IMPORTANTE, tener un vercel.json en nuestro back para que vercel pueda reconocer nuestra api.
- Creamos el archivo con la siguiente configuracion:
            {
                "version": 2,
                "builds": [
                    { "src": "src/main.js", "use": "@vercel/node" }
                ],    
                "routes": [
                    { "src": "/(.*)", "dest": "/src/main.js" }
                ]
            }

Una vez hecha toda esta nueva configuracion, vamos a vercel desde el navegador y le damos a deployed, dejamos todo por defecto y agregamos las varibales de entorno.

Una vez desplegado nuestro back en vercel, vamos a ver si funciona
- Copiamos el link y lo pasamos a postman creando una nueva URLapi

### CLASE 22
- Empezamos a crear las rutas para los workspaces.
//Obtener la lista de espacios de trabajo DEL CLIENTE QUE ME ESTA CONSULTANDO.
workspaceRouter.get('/', WorkspaceController.getAll)

Yo quiero obtener una lista de espacios de trabajo de un usuario y no de todo el mundo.

- Pasamos a crear el servicio de espacios de trabajo (workspaces.service.js) en nuestra carpeta de servicios.

- A parte del servicio creamos un archivo llamado workspace.controller.js que se va a encargar de hacer el manejo de errores del WorkspaceService.
- Dentro de este creamos la clase WorkspaceController quien va a manejar los errores.

            class WorkspaceController {
                static async getAll(req, res) {
                    try {
                        const workspaces = await WorkspaceService.getAll()
                        res.status(200).json({
                            ok: true,
                            status: 200,
                            message: "Lista de workspaces obtenida correctamente",
                            data: {
                                workspaces: workspaces
                            }
                        })
                    }
                    catch (error) {
                        if (error.status) {
                            res.send(`<h1>${error.message}</h1>`)
                        }
                        else {
                            console.error(error.message)
                            res.send('<h1>Error interno en el servidor</h1>')
                        }

                    }
                }
            }
            export default WorkspaceController

- Ahora necesito saber el user_id del cliente para saber exactamente quien es y que lista debo darle
- De donde puedo saber el user_id? Vamos a saberlo y verificarlo desde un middleware.
        function authMiddleware(req, res, next) {
            try {
                const auth_header = req.headers.authorization
                if(!auth_header){
                    throw new ServerError(401, 'No hay header de sesion')
                }
                const auth_token = auth_header.split(' ')[1]
                if(!auth_token){
                    throw new ServerError(401, 'No hay token de sesion')
                }
                const user_session_data = jwt.verify(auth_token, ENVIRONMENT.SECRET_JWT)

                //HOT POINT: Guardamos los datos del token dentro de la request
                req.user = user_session_data
                next()
            } catch (error) {
                if(error instanceof JsonWebTokenError){
                    res.status(400).json(
                        {
                            ok: false,
                            message: 'Token invalido',
                            status: 400
                        }
                    )
                } 
                else if(error instanceof jwt.TokenExpiredError){
                    res.status(401).json(
                        {
                            ok: false,
                            message: 'Token expirado',
                            status: 401
                        }
                    )
                }
                else if(error.status){
                    return res.status(error.status).json(
                        {
                            ok: false,
                            message: error.message,
                            status: error.status
                        }
                    )
                }
                else{
                    console.error('ERROR AL OBTENER EL TOKEN', error)
                    return res.status(500).json({
                        ok: false,
                        message: 'Error interno en el servidor',
                        status: 500
                    })
                }
            }
        }

*Explicacion:*
- Define una funcion llamada authMiddleware que se utiliza como middleware en una aplicacion Express.js. El proposito de este middleware es autenticar las solicitudes verificando la presencia y validez de un JWT (Json Web Token) en los encabezados de la solicitud.
- Descripcion paso a paso:
    1. Obtiene el encabezado `authorization` de la solicitud utilizando `req.headers.authorization`.
    2. Si el encabezado `authorization` no esta presente, lanza un `ServerError` con un codigo de estado 401 y un mensaje indicando que no hay encabezado de sesion.
    3. Divide el encabezado `authorization` en dos partes utilizando el caracter de espacio como dilimitador. La segunda parte se asume que es el JWT.
    4. Si el JWT no esta presente, lanza un `ServerError` con un codigo de estado 401 y un mensaje indicando que no hay token de sesion.
    5. Verifica el JWT utilizando la funcion `jwt.verify` de la biblioteca `jsonwebtoken`, pasando el JWT y una clave secreta de `ENVIRONMENT.SECRET_JWT`.
    6. Si el JWT es valido, guarda los datos decodificados en la propiedad `req.user`.
    7. Llama a la funcion `next` para pasar el control al siguiente middleware o controlador de rutas.
    8. Si ocurre un error durante el proceso de verificacion del JWT, verifica el tipo de error
        - Si el error es una instancia de JsonWebTokenError, envía una respuesta JSON con un código de estado 400 y un mensaje indicando que el token es inválido.
        - Si el error es una instancia de jwt.TokenExpiredError, envía una respuesta JSON con un código de estado 401 y un mensaje indicando que el token ha expirado.
        - Si el error tiene una propiedad status, envía una respuesta JSON con el mismo código de estado y mensaje que el error.
        - Si ninguna de las condiciones anteriores se cumple, registra el error y envía una respuesta JSON con un código de estado 500 y un mensaje de error genérico


- Este middleware lo puedo pasar a las rutas de mis workspaces en workspace.router.js
            workspaceRouter.get('/', 
                authMiddleware,
                WorkspaceController.getAll)


- Despues de crear el workspaceMiddleware, pasamos a hacer una prueba:
    - Vamos al archivo de rutas y creamos un get hacia /:workspace_id/test


### Clase 23
- Para hacer la invitacion al espacio de trabajo:
    Client(admin) va a hacer un POST a /api/workspace/:workspace_id/invite
    Y vamos a estar pasando por body:{
                                        email: "usuarioinvitado@gmail.com"
                                     }

- Nuestra api le va a enviar un mail al invitado, que pueda contener un link de invitacion al workspace y que esto verifique su auth_token

- La idea es que el link de unirse tenga un invite_token{
                                                            id_workspace,
                                                            id_inviter,
                                                            id_invited,
                                                            role: 'user'
                                                        }

- Muy importante, el invite solo lo puede hacer un administrador(hacer verificacion)

- Hitos a lograr para conseguir hacer el invite:
                - Verificar que exista un usuario (EN LA DB) con el email_invited
                    Por?: Hay que chequear que el usuario invitado exista
                    Ejemplo: Los invito a un grupo de wpp y ustedes no tienen wpp.
                    Si no existe tirar un error 404
                
                - Verificar que YA NO ESTE en el workspace, sino seria un miembro duplicado

                - Generar un token con:
                    {
                        id_invited,
                        id_inviter,
                        id_workspace,
                        invited_role
                    }
                
                - Enviar el mail de invitacion
                    Ejemplo:
                        `
                        <h1>Has sido invitado al Workspace: ${workspace_selected.name}</h1>
                        <a href="${URL_FRONTEND}/api/member/confirm/${invite_token}">Aceptar</a>
                        `

- Vamos al archivo de workspaceService y hacemos la logica de negocio:
        static async invite(member, workspace_selected, email_invited, role_invited) {
            console.log(member, workspace_selected, email_invited, role_invited)
            const user_invited = await UserRepository.getByEmail(email_invited)
            console.log(user_invited)
            if(!user_invited){
                throw new ServerError(404, 'El usuario invitado no existe')
            }

            const already_member = await MembersWorkspaceRepository.getByUserIdAndWorkspaceId(user_invited._id, workspace_selected._id)
            if(already_member){
                throw new ServerError(400, `${member.name} ya existe en el espacio de trabajo`)
            }

            const invitation_token = jwt.sign(
                {
                    id_invited: user_invited._id,
                    id_inviter: member._id,
                    id_workspace: workspace_selected._id,
                    invited_role: role_invited
                },
                ENVIRONMENT.SECRET_JWT,
                {
                    expiresIn: "7d"
                }
            )

            await mailTransporter.sendMail({
                to: email_invited,
                from: ENVIRONMENT.GMAIL_USER,
                subject: 'Te han invitado a un espacio de trabajo',
                html: `
                        <h1>Has sido invitado al workspace: ${workspace_selected.name}</h1>
                        <a href=${ENVIRONMENT.BACKEND_URL}/api/member/confirm/${invitation_token}>Aceptar</a>
                `
            })

        }

- Ahora toca hacer algo super importante, y es crear la ruta de la consulta al backend '/api/member/confirm'
- Creamos un archivo nuevo que va a ser... member.router.js
        const memberRouter = express.Router()

        memberRouter.get('/confirm/:invitation_token',
            MemberController.confirmInvitation)

        export default memberRouter

- Creamos el controlador correspondiente
        class MemberController {
            static async confirmInvitation(req, res) {
                try {
                    // Una vez que tenemos el token, lo decodificamos
                    const { invitation_token } = req.params
                    await MemberWorkspaceService.confirmInvitation(invitation_token)

                    res.redirect(ENVIRONMENT.FRONTEND_URL + '/login')
                } catch (error) {
                    if (error instanceof jwt.JsonWebTokenError) {
                        res.status(400).json(
                            {
                                ok: false,
                                message: 'Token invalido',
                                status: 400
                            }
                        )
                    }
                    else if (error instanceof jwt.TokenExpiredError) {
                        res.status(401).json(
                            {
                                ok: false,
                                message: 'Token expirado, vuelve a solivcitar la invitacion',
                                status: 401
                            }
                        )
                    }

                    else if (error.status) {
                        res.send(`<h1>${error.message}</h1>`)
                    }
                    else {
                        console.error(error.message)
                        res.send('<h1>Error interno en el servidor</h1>')
                    }
                }
            }
        }

        export default MemberController



### Clase 24

- Creat un endpoint POST /workspaces/:workspace_id/channels (solo admins)
    body:{
        name
    }
    crear un nuevo canal.

- Crear una ruta GET /workspaces/:workspace_id
- Obtener los detalles de un espacio de trabajo
- Cargar la lista de canales de un espacio de trabajo (opcional)
