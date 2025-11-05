import User from "../models/User.model.js"

class UserRepository {

    static async create(name, email, password) {
        try {
            return await User.insertOne({
                name: name,
                email: email,
                password: password
            })
            console.log('[SERVER]: usuario creado con exito')
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo crear el usuario', error)
            throw error
        }
    }

    static async getAll() {
        try {
            const users = await User.find({active: true})
            console.log(users)
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
            console.log(userById)
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
            console.log(userByEmail)
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
            console.log(deleteUser)
            return deleteUser
        }
        catch (error) {
            console.error('[SEVER ERROR]: No se encontro el usuario para eliminar ', error)
            throw error
        }
    }

    static async updateById(user_id, update_user){
        try{
            await User.findByIdAndUpdate(
                user_id,
                update_user
            )
            console.log('[SERVER]: Usuario actualizado con exito ' )
        }
        catch(error){
            console.error('[SERVER ERROR]: No se encontro el usuario a actualizar ', error)
            throw error
        }
    }
}

// Yo puedo hacer esto directamente ya que son estaticos
//UserRepository.create() //Sin instanciar

//Y no hace falta instaciarlos de esta manera
//const userRepository = new UserRepository() // Instanciado.

export default UserRepository