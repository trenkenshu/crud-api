import * as express from 'express'
import userRouter from '../routes/users'

const server = express()
server.use(express.json())
server.use('/api/users', userRouter)
server.use((req, res) => res.status(404).send(`No such page! Try using /api/users ;)`))

export default server