import { ICheckInsRepository } from '@/repositories/interfaces/checkInsRepository'
import { IGymRepository } from '@/repositories/interfaces/gymRepository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resourceNotFoundError'
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates'
import { MaxDistanceError } from './errors/maxDistanceError'
import { MaxNumbersOfCheckInsError } from './errors/maxNumbersOfCheckInsError'

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymRepository: IGymRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumbersOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
