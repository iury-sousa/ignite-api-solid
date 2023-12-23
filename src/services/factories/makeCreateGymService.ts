import { GymRepository } from '@/repositories/gymRepository'
import { CreateGymService } from '../createGym'

export function makeCreateGymService() {
  const gymRepository = new GymRepository()
  const service = new CreateGymService(gymRepository)

  return service
}
