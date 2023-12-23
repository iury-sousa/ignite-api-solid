import { UserRepository } from '@/repositories/userRepository'
import { AuthenticateService } from '../authenticate'

export function makeAuthenticateService() {
  const userRepository = new UserRepository()
  const authenticateService = new AuthenticateService(userRepository)

  return authenticateService
}
