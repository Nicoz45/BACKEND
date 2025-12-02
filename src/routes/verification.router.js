import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import verificationController from '../controllers/verification.controller.js'

const verificationRouter = express.Router()

verificationRouter.post('/send-code',
    authMiddleware,
    verificationController.sendCode
)

verificationRouter.post('/verify-code',
    authMiddleware,
    verificationController.verifyCode
)

export default verificationRouter

