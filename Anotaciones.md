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
