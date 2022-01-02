import { Connection, createConnection} from 'typeorm'

import request from 'supertest'

import { app } from '../../../../app'

let connection: Connection

describe('Create a new user', ()=>{

  beforeAll( async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async ()=>{

    const responseAuth = await request(app).post("/api/v1/users").send({
      name: "Paulo",
      email: "paulo@gmail.com",
      password: "123456"
    })
    expect(responseAuth.status).toBe(201)

  })
})
