import verificationService from "../services/verification.service.js"

class verificationController{
    static async sendCode(req, res){
        try {
            const user = req.user
            const result = await verificationService.sendVerificationCode(user.id)
            res.status(200).json({
                ok:true,
                status:200,
                message: result.message
            })
        } catch (error) {
            if(error.status){
                return res.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error(error.message)
                return res.status(500).json({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                })
            }
        }
    }

    static async verifyCode(req, res){
        try {
            const user = req.user
            const {code} = req.body

            if(!code){
                return res.status(400).json({
                    ok: false,
                    message: 'El codigo es requerido',
                    status: 400
                })
            }

            const result = await verificationService.verifyCode(user.id, code)
            res.status(200).json({
                ok: true,
                status: 200,
                message: result.message,
                data: {
                    verified: result.verified
                }
            })
        } catch (error) {
            if(error.status){
                return res.status(error.status).json({
                ok: false,
                message: error.message,
                status: error.status
            })
            }
            else{
                console.error('ERROR AL VERIFICAR EL CODIGO', error)
                return res.status(500).json({
                    ok: false,
                    message: 'Error interno en el servidor',
                    status: 500
                })
            }
        }
    }
}

export default verificationController