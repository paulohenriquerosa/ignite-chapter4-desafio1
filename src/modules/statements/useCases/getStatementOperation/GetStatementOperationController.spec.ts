import { Connection, createConnection} from 'typeorm'

import request from 'supertest'

import { app } from '../../../../app'

let connection: Connection


describe("Get Statement", ()=>{


  beforeAll( async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get a statemet", async ()=>{
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

    const resultDeposit = await request(app).post('/api/v1/statements/deposit').send({
      amount: 250,
      description: "compra"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const statementId = resultDeposit.body.id

    const resultStatement = await request(app).get(`/api/v1/statements/${statementId}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(resultStatement.body).toHaveProperty("amount")
    expect(resultStatement.body).toHaveProperty("description")
    expect(resultStatement.body.description).toBe("compra")

  })

})
