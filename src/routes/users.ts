import * as express from 'express'
import { getAll, getById, create, edit, deleteUser } from '../db-api'

const userRouter = express.Router()

userRouter.get('/:id', getById)
userRouter.get('/', getAll)
userRouter.post('/', create)
userRouter.put('/:id', edit)
userRouter.delete('/:id', deleteUser)

export default userRouter
