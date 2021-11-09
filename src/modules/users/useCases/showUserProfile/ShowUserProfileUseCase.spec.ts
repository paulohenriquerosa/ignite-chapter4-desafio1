
import {ShowUserProfileUseCase } from './ShowUserProfileUseCase'
import {InMemoryUsersRepository }   from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase'


let showUserProfileUseCase: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe('Show Profile', ()=>{

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("Should be able to return profile info", async()=>{

    const { id } = await createUserUseCase.execute({
      name:'user',
      password:'123456',
      email: 'user@examplo'
    })
    const user_id = id as string

    await authenticateUserUseCase.execute({
      email: 'user@examplo',
      password:'123456',
    })


    const profile = await showUserProfileUseCase.execute(user_id)

    expect(profile).toHaveProperty('name')
    expect(profile).toHaveProperty('email')
    expect(profile.name).toEqual('user')
    expect(profile.email).toEqual('user@examplo')

  })

})
