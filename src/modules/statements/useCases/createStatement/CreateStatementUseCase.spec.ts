
import { CreateStatementUseCase }  from './CreateStatementUseCase'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'

import {CreateStatementError } from './CreateStatementError'

let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement ", ()=>{

  beforeEach(()=>{

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )

  })

  it('Should be able to create a deposit', async ()=>{

    const user = await inMemoryUsersRepository.create({
      name:"Test",
      email:"example@gmail.com",
      password: "12345678"
    })

    const statement = await createStatementUseCase.execute({
      amount: 25,
      description: "Another test",
      user_id:  user.id ? user.id : 'GENERIC-ID',
      type: OperationType.DEPOSIT

    })

    expect(statement).toHaveProperty('amount')
    expect(statement).toHaveProperty('type')
    expect(statement.type).toEqual(OperationType.DEPOSIT)

  })


  it('Should not be able get balance info without user', async()=>{

    await inMemoryStatementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 25.0,
      description: "Salary",
      user_id: "GENERIC-ID"
    })

    await inMemoryStatementsRepository.create({
      type: OperationType.WITHDRAW,
      amount: 15.0,
      description: "Tax",
      user_id: "GENERIC-ID"
    })

    await expect(createStatementUseCase.execute({
      amount: 25,
      description: "Another test",
      user_id: 'GENERIC-ID',
      type: OperationType.DEPOSIT

    })).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('Should be able get balance info without sufficient found', async()=>{

    const user = await inMemoryUsersRepository.create({
      name:"Test",
      email:"example@gmail.com",
      password: "12345678"
    })

    await expect(createStatementUseCase.execute({
      amount: 25,
      description: "Another test",
      user_id:  user.id ? user.id : 'GENERIC-ID',
      type: OperationType.WITHDRAW

    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it('Should not be able get balance info without sufficient found', async()=>{

    const user = await inMemoryUsersRepository.create({
      name:"Test",
      email:"example@gmail.com",
      password: "12345678"
    })

    await expect(createStatementUseCase.execute({
      amount: 25,
      description: "Another test",
      user_id:  user.id ? user.id : 'GENERIC-ID',
      type: OperationType.WITHDRAW

    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

})
