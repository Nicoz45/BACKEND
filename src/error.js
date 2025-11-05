/* import { sumar } from "./math.js"  */

class CustomError extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}

export default CustomError

/* console.log("hola samuel") */

/* try{
    //try intentara ejecutar este bloque de codigo
    console.log(sumar(58))
}
catch(error){
    //En caso de que el bloque falle
    //catch atrapara el error y ejecutara su bloque de codigo.
    console.log('La operacion sumar ha fallado')
    console.log('RAZON:', error)
}
finally{
    //Finalmente o independientemente de lo que pase ejecuta esto.
    console.log("Finalizo el intento de ejecucion de sumar.")
} */
console.log('Accion super importante')

/* const ejecutarSuma = () => {
    try {
        //try intentara ejecutar este bloque de codigo
        console.log(sumar(58))
    }
    catch (error) {
        //En caso de que el bloque falle
        //catch atrapara el error y ejecutara su bloque de codigo.
        console.log('La operacion sumar ha fallado')
        console.log('RAZON:', error)
    }
    finally {
        //Finalmente o independientemente de lo que pase ejecuta esto.
        console.log("Finalizo el intento de ejecucion de sumar.")
    }
} 

ejecutarSuma()*/

const manejarError = (accionCallback) => {
    try{
        accionCallback()
    }
    catch(error){
        if(error.status){
            console.error("[CLIENT ERROR]: " + error.message, "Status: " + error.status)
        }
        else{
            console.error("[SERVER ERROR]: " + error.message)
        }
    }
}

/* manejarError(() => {sumar(98)}) */


export class ServerError extends Error {
    constructor(status, message){
        super(message)
        this.status = status
    }
}