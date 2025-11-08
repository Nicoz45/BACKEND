import dotenv from 'dotenv'

//Cargar las variables de entorno en process.env
dotenv.config()

const ENVIRONMENT = {
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
    PORT: process.env.PORT,
    SECRET_JWT: process.env.SECRET_JWT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_URL_DEPLOY: process.env.FRONTEND_URL_DEPLOY,
    //MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    //MONGO_DB_HOST: process.env.MONGO_DB_HOST,
}

console.log(ENVIRONMENT)

export default ENVIRONMENT