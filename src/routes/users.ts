import express from 'express'
import { getAll, getById, create, edit } from '../db-api'

const userRouter = express.Router()

userRouter.get('/:id', getById)
userRouter.get('/', getAll)
userRouter.post('/', create)
userRouter.put('/', edit)

export default userRouter
