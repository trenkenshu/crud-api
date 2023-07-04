import { Request, Response } from "express";
//import db from "../db";
import { IdbItem } from "../db/types";
import * as c from 'cluster';

const cluster = c as unknown as c.Cluster;
let db: IdbItem[] = [];

export const updateDb = (newDb: IdbItem[]) => db = newDb

export const validateId = (id: string): boolean => {
  return /^[0-9]{20}$/.test(id)
}

const generateId = ():string => {
  let answer = ''
  for(let i = 0; i < 4; i++) {
    answer += String(Math.random()).slice(2, 7)
  }
  if(db.find((item: IdbItem) => item.id === answer)) {
    return generateId()
  }
  return answer
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

export const create = (req: Request, res: Response): void => {
  const { username, age, hobbies } = req.body
  if(typeof username === 'string'
    && typeof age === 'number'
    && hobbies instanceof Array
    && hobbies.every(item => typeof item === 'string')) {

      const answer = {
      id: generateId(),
      username,
      age: Number(age),
      hobbies: hobbies,
    }
    db.push(answer)
    res.status(201)
    res.json(answer)
    if(cluster.isWorker) {
      process.send(JSON.stringify(db))
    }
  } else {
    res.status(400)
    res.send('You should specify all the required params with correct types: username, age, hobbies')
  }
}

export const edit = (req: Request, res: Response): void => {
  const { id } = req.params
  const { username, age, hobbies } = req.body
  if(!validateId(id)) {
    res.status(400)
    res.send('Cant update user with incorrect id, it should be 20 digits string')

    return
  }

  const user = db.find(item => item.id === id)
  if(user) {
    username
      && typeof username === 'string'
      && Object.defineProperty(user,  'username', {
        value: username
      } )
    age
      && typeof age === 'number'
      && Object.defineProperty(user, 'age', {
        value: age
      })
    hobbies instanceof Array
      && hobbies.every(item => typeof item === 'string')
      && Object.defineProperty(user, 'hobbies', {
        value: hobbies
      })

    res.status(200)
    res.json(user)
    if(cluster.isWorker) {
      process.send(JSON.stringify(db))
    }

    return
  }

  res.status(404)
  res.send('Cant update user, there\'s not a sigle one that match the id provided')
}

export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  if(!validateId(id)) {
    res.status(400)
    res.send('Incorrect id format, is should be 20 digits string')

  return
  }

  const user = db.find(item => item.id === id)
  if(user) {
    const index = db.indexOf(user)
    const deleted = db.splice(index, 1)[0]
    res.status(204)
    res.send()
    if(cluster.isWorker) {
      process.send(JSON.stringify(db))
    }

    return
  }

  res.status(404)
  res.send('Cant find user that match the id provided')
}
