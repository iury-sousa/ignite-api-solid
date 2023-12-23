import { Prisma, User } from '@prisma/client'
import { IUserRepository } from '../interfaces/userRepository'
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = []

  async findById(userId: string) {
    return this.items.find((item) => item.id === userId) || null
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
