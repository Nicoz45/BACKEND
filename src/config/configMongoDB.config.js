import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";


async function connectToMongoDB(){
    try{
        const connection_string = ENVIRONMENT.MONGO_DB_CONNECTION_STRING
        await mongoose.connect(connection_string)
    }
    catch(error){
        console.error("Error conectando a MongoDB", error)
        throw new Error("No se pudo conectar a la base de datos")
    }
}

export default connectToMongoDB