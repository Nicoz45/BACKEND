import dotenv from 'dotenv'

//Cargar las variables de entorno en process.env
dotenv.config()

const ENVIRONMENT = {
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
    PORT: process.env.PORT,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_DB_HOST: process.env.MONGO_DB_HOST,
    SECRET_JWT: process.env.SECRET_JWT,
    FRONTEND_URL: process.env.FRONTEND_URL
}

console.log(ENVIRONMENT)

export default ENVIRONMENT