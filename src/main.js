import express from 'express';
import authRouter from './routes/auth.router.js';
import workspaceRouter from './routes/workspace.router.js';
import connectToMongoDB from './config/configMongoDB.config.js';
import dotenv from 'dotenv'
import ENVIRONMENT from './config/environment.config.js';
import mailTransporter from './config/mailTransporter.config.js';
import cors from 'cors';
import memberRouter from './routes/member.router.js';


connectToMongoDB()

const app = express();
//Configuro a mi api como api publica, cualquier dominio va a poder hacer consultas a mi api
app.use(express.json())
app.use(cors());


// Todas las consultas que empicen con /api/auth van a ser gestionadas con authRouer.
app.use('/api/auth',authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/member', memberRouter)

/* mailTransporter.sendMail(
    {
        from: ENVIRONMENT.GMAIL_USER,
        to: 'gisellezarate99@gmail.com',
        subject: 'Mail de prueba',
        html: '<h1> Has sido hackeada por nico fitness</h1>'
    }
) */


app.listen(ENVIRONMENT.PORT || 8080, () => {
    console.log(`Tu servidor se esta ejecutando correctamente en el puerto ${ENVIRONMENT.PORT}`)
})
