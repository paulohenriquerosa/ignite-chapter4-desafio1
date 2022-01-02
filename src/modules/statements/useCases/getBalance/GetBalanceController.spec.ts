import { Connection, createConnection} from 'typeorm'

import request from 'supertest'

import { app } from '../../../../app'

let connection: Connection

describe('Get balance', ()=>{

  beforeAll( async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able get balance', async ()=>{
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

    const responseBalance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`,
    })

    expect(responseBalance.body).toHaveProperty('statement')
    expect(responseBalance.body).toHaveProperty('balance')
    expect(responseBalance.body.balance).toBe(250)

  })
})
