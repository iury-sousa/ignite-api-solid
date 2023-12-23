import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { IUserRepository } from './interfaces/userRepository'

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }

  async create(data: Prisma.UserCreateInput) {
    const user = prisma.user.create({
      data,
    })

    return user
  }
}
