import { CheckInsRepository } from '@/repositories/checkInsRepository'
import { ValidateCheckInService } from '../validateCheckIn'

export function makeValidateCheckInService() {
  const checkInsRepository = new CheckInsRepository()
  const service = new ValidateCheckInService(checkInsRepository)

  return service
}
