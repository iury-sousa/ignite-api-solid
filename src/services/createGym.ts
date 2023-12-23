import { IGymRepository } from '@/repositories/interfaces/gymRepository'
import { Gym } from '@prisma/client'

interface CreateGymServiceProps {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymServiceResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymRepository: IGymRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymServiceProps): Promise<CreateGymServiceResponse> {
    const gym = await this.gymRepository.create({
      description,
      latitude,
      longitude,
      phone,
      title,
    })

    return { gym }
  }
}
