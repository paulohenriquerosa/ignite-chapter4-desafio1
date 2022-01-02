
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'



let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", ()=>{


  beforeEach(()=>{
    inMemoryUsersRepository =  new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })


  it("Should be able authenticate a user", async ()=>{

    await createUserUseCase.execute({
      name: 'user',
      password: '123456',
      email:'user@examplo'
    })

    const response = await authenticateUserUseCase.execute({
      email:'user@examplo',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
    expect(response).toHaveProperty('user')

  })
  it("Should not be able authenticate a user with wrong email", async ()=>{

    createUserUseCase.execute({
      name: 'user',
      password: '123456',
      email:'user@examplo'
    })
    await expect( authenticateUserUseCase.execute({
      email:'wrong_email',
      password: '123456',
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })
})
