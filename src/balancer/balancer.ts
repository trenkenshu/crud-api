import * as express from 'express'
import * as c from 'cluster'
import * as dotenv from 'dotenv'
import * as http from 'http'

dotenv.config()

const cluster = c as unknown as c.Cluster;
export const balancesIterator = (workersArr: { worker: c.Worker, port: number }[]): express.Express => {
  const balancer = express()
  balancer.use(express.json())
  balancer.use(async (req: express.Request, res: express.Response) => {
    const next = workersArr.shift()
    workersArr.push(next)
    const reqBody = req.body
    console.log(`Fetching from http://localhost:${next.port}${req.path}`)
    const request: {method: string; headers: Record<string, string>; body?: string} = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' }
    }
    req.method === 'POST' || req.method === 'PUT'
      ? request.body = JSON.stringify(reqBody)
      : true;
    const answer = await fetch(`http://localhost:${next.port}${req.path}`, request)
    if(answer.ok && req.method !== 'DELETE') {
      const newData = await answer.json()
      res.status(answer.status).json(newData)
    } else if(req.method === 'DELETE') {
      res.status(answer.status).send()
    } else {
      const newData = await answer.text()
      res.status(answer.status).send(newData)
    }
  })

  return  balancer
}
