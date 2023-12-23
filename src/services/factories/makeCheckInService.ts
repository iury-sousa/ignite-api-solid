import { CheckInsRepository } from '@/repositories/checkInsRepository'
import { GymRepository } from '@/repositories/gymRepository'
import { CheckInService } from '../checkin'

export function makeCheckInService() {
  const checkInsRepository = new CheckInsRepository()
  const gymRepository = new GymRepository()
  const service = new CheckInService(checkInsRepository, gymRepository)

  return service
}
