import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json());

import authRouter from './routes/auth.routes.js'
app.use("/api/v1/auth",authRouter)

export{app}