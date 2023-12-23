import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterService } from '../register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/inMemoryUserRepository'
import { UserAlreadyExistsError } from '../errors/userAlreadyExistsError'

let userRepository: InMemoryUserRepository
let registerService: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    registerService = new RegisterService(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerService.execute({
      name: 'John doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registratio', async () => {
    const { user } = await registerService.execute({
      name: 'John doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to registration with same email twice', async () => {
    const email = 'johndoe@example.com'

    await registerService.execute({
      name: 'John doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerService.execute({
        name: 'John doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
