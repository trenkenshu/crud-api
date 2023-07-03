import { Request, Response } from "express";
import db from "../db";

export const validateId = (id: string): boolean => {
  return /^[0-9]{20}$/.test(id)
}

export const getAll = (req: Request, res: Response): void => {
  res.status(200)
  res.json(db)
}

export const getById = (req: Request, res: Response): void => {
  const { id } = req.params;
  if(!validateId(id)) {
    res.status(400)
    res.send('Incorrect id format, is should be 20 digits string')

  return
  }

  const answer = db.find(item => item.id === id)
  if (answer) {
    res.status(200)
    res.json(answer)

    return
  }

  res.status(404)
  res.send(`User with id ${id} does not exist`)

  return
}

