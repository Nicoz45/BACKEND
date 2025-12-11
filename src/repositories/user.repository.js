import User from "../models/User.model.js"

class UserRepository {

    static async create(name, email, password) {
        try {
            const newUser = await User.insertOne({
                name: name,
                email: email,
                password: password
            })
            return newUser
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo crear el usuario', error)
            throw error
        }
    }

    static async getAll() {
        try {
            const users = await User.find({active: true})
            return users
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener la lista de Usuarios', error)
            throw error
        }
    }

    static async getById(user_id) {
        try {
            const userById = await User.findById(user_id)
            return userById
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener la lista de Usuarios', error)
            throw error
        }
    }

    static async getByEmail(email) {
        try {
            const userByEmail = await User.findOne({ email: email, active: true })
            return userByEmail
        }
        catch (error) {
            console.error('[SERVER ERROR]: Usuario no encontrado ', error)
            throw error
        }
    }

    static async deleteById(user_id) {
        try {
            const deleteUser = await User.findByIdAndDelete(user_id)
            return deleteUser
        }
        catch (error) {
            console.error('[SEVER ERROR]: No se encontro el usuario para eliminar ', error)
            throw error
        }
    }

    static async updateById(user_id, update_user){
        try{
            const userUpdated = await User.findByIdAndUpdate(
                user_id,
                update_user
            )
            return userUpdated
        }
        catch(error){
            console.error('[SERVER ERROR]: No se encontro el usuario a actualizar ', error)
            throw error
        }
    }
}

export default UserRepository