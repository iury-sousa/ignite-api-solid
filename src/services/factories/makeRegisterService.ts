import { UserRepository } from '@/repositories/userRepository'
import { RegisterService } from '../register'

export function makeRegisterService() {
  const userRepository = new UserRepository()
  const registerService = new RegisterService(userRepository)

  return registerService
}
