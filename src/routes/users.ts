import express from 'express'
import { getAll, getById, create } from '../db-api'

const userRouter = express.Router()

userRouter.get('/:id', getById)
userRouter.get('/', getAll)
userRouter.post('/', create)

export default userRouter
