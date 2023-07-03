import server from './server'
import request = require('supertest')
import * as dotenv from 'dotenv'
import * as http from 'http'

dotenv.config()
describe('test crud api', () => {
  test('GET all from empty database', async () => {
    const res = await request(server)
      .get(`/api/users`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual([])
  })

  test('POST new user to database and get them back as a response', async () => {
    const res = await request(server)
      .post(`/api/users`)
      .send({
        username: 'john',
        age: 30,
        hobbies: ['programming', 'eating']
      })
      expect(res.statusCode).toEqual(201)
      expect(res.body.id.length).toBe(20)
      expect(res.body.username).toBe('john')
  })

  test('GET all from database with one created user', async () => {
    const res = await request(server)
      .get(`/api/users`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.length).toBe(1)
      expect(res.body[0].username).toBe('john')
  })

  test('GET one user with incorrect id and receive 400', async () => {
    const res = await request(server)
      .get(`/api/users/incorrect`)
      expect(res.statusCode).toEqual(400)
  })

  test('Create one user and get them by id', async () => {
    const res = await request(server)
      .post(`/api/users`)
      .send({
        username: 'john',
        age: 30,
        hobbies: ['programming', 'eating']
      })
    const id = res.body.id
    const secondRes = await request(server)
      .get(`/api/users/${id}`)
    expect(secondRes.statusCode).toEqual(200)
    expect(secondRes.body).toEqual(res.body)
  })

  test('Open random address and get 404', async () => {
    const res = await request(server)
      .get(`/random/address`)
      expect(res.statusCode).toEqual(404)
  })
})
