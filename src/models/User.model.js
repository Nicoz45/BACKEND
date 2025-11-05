import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    modified_at: {
        type: Date,
        default: null
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    verified_email: {
        type: Boolean,
        default: false,
        required: true
    }
})

//El modelo registra el schema para cierta entidad que luego sera guardad en la coleccion.
//EJ: Quiero guardar usuarios, entonces mi entidad es usuario y registro en mongoose que para la entidad usuario 
// se debera cumplir con x schema 
const User = mongoose.model('User', userSchema)

export default User