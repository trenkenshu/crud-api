import { Request, Response } from "express";
import db from "../db";
import { IdbItem } from "../db/types";

class Api {
  database = db;
  constructor() {
    this.database = db;
  }
  validateId(id: string) {
    return /^[0-9]{20}$/.test(id)
  }

  getAll(req: Request, res: Response): void {
    res.status(200)
    res.json(this.database)
  }

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    if(!this.validateId(id)) {
      res.status(400)
      res.send('Incorrect id format, is should be 20 digits string')

      return
    }

    const answer = this.database.find(item => item.id === id)
    if(answer) {
      res.status(200)
      res.json(answer)

      return
    }

    res.status(404)
    res.send(`User with id ${id} does not exist`)

    return
  }
}

export const api = new Api()
