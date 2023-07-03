import express from 'express'
import userRouter from './routes/users'
import dotenv from 'dotenv'

dotenv.config()

const server = express()
server.use(express.json())
server.use('/api/users', userRouter)

const port = Number(process.env.PORT);
server.listen(port, () => {
  console.log(`Running on port ${port}`)
})