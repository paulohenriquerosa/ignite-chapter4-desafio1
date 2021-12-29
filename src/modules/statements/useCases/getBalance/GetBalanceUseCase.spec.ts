import { GetBalanceUseCase } from './GetBalanceUseCase'

import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'

import  {GetBalanceError} from './GetBalanceError'

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get balance', ()=>{
  beforeEach(()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository);
  })


  it('Should be able get balance info from a user', async()=>{

    const user = await inMemoryUsersRepository.create({
      name: "username",
      email: "example@gmail.com",
      password: "123456"
    })

    await inMemoryStatementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 25.0,
      description: "Salary",
      user_id:  user.id ? user.id : "GENERIC-ID"
    })
    await inMemoryStatementsRepository.create({
      type: OperationType.WITHDRAW,
      amount: 15.0,
      description: "Tax",
      user_id:  user.id ? user.id : "GENERIC-ID"
    })

    const statements = await getBalanceUseCase.execute({user_id: user.id ? user.id: "GENERIC-ID"})

    expect(statements).toHaveProperty('statement')
    expect(statements).toHaveProperty('balance')
    expect(statements.balance).toEqual(10)
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

    await expect(getBalanceUseCase.execute({user_id: "GENERIC-ID"})).rejects.toBeInstanceOf(GetBalanceError)
  })

})
