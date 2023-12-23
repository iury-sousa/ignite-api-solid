import { IGymRepository } from '@/repositories/interfaces/gymRepository'
import { Gym } from '@prisma/client'

interface SearchGymsServiceProps {
  query: string
  page: number
}

interface SearchGymsServiceResponse {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private gymRepository: IGymRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsServiceProps): Promise<SearchGymsServiceResponse> {
    const gyms = await this.gymRepository.searchMany(query, page)

    return { gyms }
  }
}
