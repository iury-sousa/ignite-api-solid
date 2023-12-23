import { IGymRepository } from '@/repositories/interfaces/gymRepository'
import { Gym } from '@prisma/client'

interface FetchNearbyGymsServiceProps {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsServiceResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private gymRepository: IGymRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsServiceProps): Promise<FetchNearbyGymsServiceResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
