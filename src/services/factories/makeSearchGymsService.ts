import { GymRepository } from '@/repositories/gymRepository'
import { SearchGymsService } from '../searchGyms'

export function makeSearchGymsService() {
  const gymRepository = new GymRepository()
  const service = new SearchGymsService(gymRepository)

  return service
}
