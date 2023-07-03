import express from 'express'
import { getAll, getById } from '../db-api'

const userRouter = express.Router()

userRouter.get('/:id', getById)
userRouter.get('/', getAll)

export default userRouter
