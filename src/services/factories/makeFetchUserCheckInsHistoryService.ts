import { CheckInsRepository } from '@/repositories/checkInsRepository'
import { FetchUserCheckInsHistoryService } from '../fetchUserCheckInsHistory'

export function makeFetchUserCheckInsHistoryService() {
  const checkInsRepository = new CheckInsRepository()
  const service = new FetchUserCheckInsHistoryService(checkInsRepository)

  return service
}
