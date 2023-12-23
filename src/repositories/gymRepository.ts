import { Gym, Prisma } from '@prisma/client'
import {
  FindManyNearbyParams,
  IGymRepository,
} from './interfaces/gymRepository'
import { prisma } from '@/lib/prisma'

export class GymRepository implements IGymRepository {
  async create(data: Prisma.GymCreateInput) {
    return prisma.gym.create({
      data,
    })
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return prisma.$queryRaw<Gym[]>`
      SELECT
        *
      FROM
        gyms
      WHERE
        ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
  }

  async searchMany(query: string, page: number) {
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findById(gymId: string) {
    return prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    })
  }
}
