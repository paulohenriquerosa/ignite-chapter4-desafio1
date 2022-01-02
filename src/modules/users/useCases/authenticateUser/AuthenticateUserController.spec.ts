import { Connection, createConnection} from 'typeorm'

import request from 'supertest'

import { app } from '../../../../app'

let connection: Connection

describe("Create a session", ()=>{

  beforeAll( async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able create a session", async ()=>{

    await request(app).post("/api/v1/users").send({
      name:'Paulo',
      email: "paulo@gmail.com",
      password:"123456"
    })

    const response = await request(app).post("/api/v1/sessions").send({
      email: "paulo@gmail.com",
      password:"123456"
    })
    expect(response.body).toHaveProperty("token")
    expect(response.body).toHaveProperty("user")

  })

  it("Should not be able create a session without user", async ()=>{

    const response = await request(app).post("/api/v1/sessions").send({
      email: "paulo@gmal.com",
      password:"12345"
    })


    expect(response.body.message).toBe('Incorrect email or password')

  })

})
