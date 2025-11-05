import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { LoginSchema, registerSchema } from "../schemas/auth.schema.js";

// Creamos una ruta de express 
const authRouter = Router()

/* authRouter.get('/test', (req, res)=>{res.json({ok: true})}) */

authRouter.post('/register', 
    validateRequest(registerSchema),
    AuthController.register)

authRouter.get('/verify-email/:verification_token', AuthController.verifyEmail) 

authRouter.post('/login',
    validateRequest(LoginSchema),
    AuthController.login
)


export default authRouter