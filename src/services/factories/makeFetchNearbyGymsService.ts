import { GymRepository } from '@/repositories/gymRepository'
import { FetchNearbyGymsService } from '../fetchNearbyGyms'

export function makeFetchNearbyGymsService() {
  const gymRepository = new GymRepository()
  const service = new FetchNearbyGymsService(gymRepository)

  return service
}
