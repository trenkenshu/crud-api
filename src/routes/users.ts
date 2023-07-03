import express from 'express'
import api from '../db-api';

const userRouter = express.Router()

userRouter.get('/:id', api.getById)
userRouter.get('/', api.getAll)

export default userRouter
