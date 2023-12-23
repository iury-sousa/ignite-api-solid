import { CheckInsRepository } from '@/repositories/checkInsRepository'
import { GetUserMetricsService } from '../getUserMetrics'

export function makeGetUserMetricsService() {
  const checkInsRepository = new CheckInsRepository()
  const service = new GetUserMetricsService(checkInsRepository)

  return service
}
