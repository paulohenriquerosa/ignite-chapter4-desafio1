import { Connection, createConnection} from 'typeorm'

import request from 'supertest'

import { app } from '../../../../app'

let connection: Connection


describe("Create Statement", ()=>{

  beforeAll( async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able create a deposit", async ()=>{

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

    expect(resultDeposit.status).toBe(201)
    expect(resultDeposit.body.amount).toBe(250)

  })


  it("Should be able create a withdraw", async ()=>{

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

    await request(app).post('/api/v1/statements/deposit').send({
      amount: 250,
      description: "compra"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const resultWithdraw = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 100,
      description: "compra"
    }).set({
      Authorization: `Bearer ${token}`,
    });


    expect(resultWithdraw.status).toBe(201)
    expect(resultWithdraw.body.amount).toBe(100)

  })
})
