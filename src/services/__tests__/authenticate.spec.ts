import { InMemoryUserRepository } from '@/repositories/in-memory/inMemoryUserRepository'
import { hash } from 'bcryptjs'
import { describe, expect, it, beforeEach } from 'vitest'
import { AuthenticateService } from '../authenticate'
import { InvalidCredentialsError } from '../errors/invalidCredentialsError'

let userRepository: InMemoryUserRepository
let authenticateService: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    authenticateService = new AuthenticateService(userRepository)
  })

  it('should be able to authenticate', async () => {
    userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await authenticateService.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateService.execute({
        email: 'johndoe@example2.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      authenticateService.execute({
        email: 'johndoe@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
