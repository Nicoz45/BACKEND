import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

// Que retorna? Una promesa (Ya que es async)
// async me permite usar await dentro de la funcion
// await me permite "esperar" a que una promesa se resuelva
// Si la promesa se resuelve, me devuelve el resultado
// Si la promesa falla, lanza una excepcion (Error)
//Esto lo puedo encerrar en un try/catch
// Si la promesa se resuelve, el resultado queda en la variable db
// Si la promesa falla, se lanza una excepcion y se captura en el catch
async function connectToMongoDB(){
    try{
        const connection_string = ENVIRONMENT.MONGO_DB_HOST + '/' + ENVIRONMENT.MONGO_DB_NAME
        await mongoose.connect(connection_string)
        console.log("Conectado a MongoDB: " + ENVIRONMENT.MONGO_DB_NAME)
    }
    catch(error){
        console.error("Error conectando a MongoDB", error)
        throw new Error("No se pudo conectar a la base de datos")
    }
}

export default connectToMongoDB