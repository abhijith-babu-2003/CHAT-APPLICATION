import express from 'express'
import dotenv  from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from '../lib/db.js';
import cors from"cors"
dotenv.config(); 
import authRoutes from '../routes/auth.route.js'
import messageRoutes from '../routes/message.route.js'
import { app ,server} from '../lib/socket.js';


app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use("/api/auth",authRoutes)

app.use("/api/message",messageRoutes)




const PORT=process.env.PORT
server.listen(PORT,()=>{
    console.log(`server is  running on port ${PORT}`)
    connectDB()
})