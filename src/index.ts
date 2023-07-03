import express from 'express'
import userRouter from './routes/users'

const server = express()
server.use('/api/users', userRouter)