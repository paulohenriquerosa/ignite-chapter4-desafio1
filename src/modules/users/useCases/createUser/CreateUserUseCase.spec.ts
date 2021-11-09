

import { CreateUserUseCase } from './CreateUserUseCase'
import {InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'

import {CreateUserError } from './CreateUserError'

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository:  InMemoryUsersRepository

describe("Create a new user", ()=>{

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async()=>{

    const user = await createUserUseCase.execute({
      email: "user@examplo.com",
      name: 'user-1',
      password: '123456'
    })
    expect(user).toHaveProperty('id')
    expect(user.name).toEqual('user-1')
    expect(user.email).toEqual('user@examplo.com')
  })
  it("Should not be able to create a new user with exist email", async()=>{



    await createUserUseCase.execute({
      email: "user@examplo.com",
      name: 'user-1',
      password: '123456'
    })

    await expect(createUserUseCase.execute({
      email: "user@examplo.com",
      name: 'user-2',
      password: '123456'
    })).rejects.toBeInstanceOf(CreateUserError)
  })
})
