import { UserRepository } from '@/repositories/userRepository'
import { GetUserProfileService } from '../getUserProfile'

export function makeGetUserProfileService() {
  const userRepository = new UserRepository()
  const service = new GetUserProfileService(userRepository)

  return service
}
