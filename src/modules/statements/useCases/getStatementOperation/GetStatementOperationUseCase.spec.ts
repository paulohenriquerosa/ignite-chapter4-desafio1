
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'

import {GetStatementOperationUseCase } from './GetStatementOperationUseCase'
import { GetStatementOperationError } from './GetStatementOperationError'

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getStatementOperationUseCase : GetStatementOperationUseCase


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement Operation", ()=>{

  beforeEach(()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository =  new InMemoryUsersRepository()

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it('Should be able get statement Operation', async ()=>{

    const user = await inMemoryUsersRepository.create({
      name: "username",
      email: "example@gmail.com",
      password: "123456"
    })

    const user_id =  user.id ? user.id : "GENERIC-ID"

    const statement = await inMemoryStatementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 25.0,
      description: "Salary",
      user_id
    })


    const result = await getStatementOperationUseCase.execute({
      user_id,
      statement_id: statement.id? statement.id: "GENERIC-ID"
    })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('amount')

  })


  it('Should not be able get without existence statement Operation ', async ()=>{

    const user = await inMemoryUsersRepository.create({
      name: "username",
      email: "example@gmail.com",
      password: "123456"
    })

    const user_id =  user.id ? user.id : "GENERIC-ID"



    await expect(
      getStatementOperationUseCase.execute({
        user_id,
        statement_id: "GENERIC-ID"
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)

  })

  it('Should not be able get statement Operation without a valid user', async ()=>{

    const statement = await inMemoryStatementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 25.0,
      description: "Salary",
      user_id: "GENERIC-ID"
    })

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "GENERIC-ID",
        statement_id: statement.id? statement.id: "GENERIC-ID"
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)


  })

})
