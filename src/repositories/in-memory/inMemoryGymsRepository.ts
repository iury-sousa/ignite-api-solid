import { Gym, Prisma } from '@prisma/client'
import {
  FindManyNearbyParams,
  IGymRepository,
} from '../interfaces/gymRepository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates'

export class InMemoryGymsRepository implements IGymRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    return this.items.find((item) => item.id === gymId) || null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }
}
