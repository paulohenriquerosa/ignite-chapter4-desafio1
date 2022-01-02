
import { Connection, createConnection} from 'typeorm'

import request from 'supertest'

import { app } from '../../../../app'

let connection: Connection

describe('Show user profile', ()=>{

  beforeAll( async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able show user info', async ()=>{

    await request(app).post("/api/v1/users").send({
      name:"Paulo",
      email:'paulo@gmail.com',
      password:'123456'
    })

    const response = await request(app).post("/api/v1/sessions").send({
      email:'paulo@gmail.com',
      password:'123456'
    })

    const {token} = response.body

    const responseUser = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`,
    });


    expect(responseUser.body).toHaveProperty("id")
    expect(responseUser.body).toHaveProperty("name")
    expect(responseUser.body).toHaveProperty("email")

  })

})
