import { InMemoryCheckInsRepository } from '@/repositories/in-memory/inMemoryCheckInsRepository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from '../checkin'
import { InMemoryGymsRepository } from '@/repositories/in-memory/inMemoryGymsRepository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumbersOfCheckInsError } from '../errors/maxNumbersOfCheckInsError'
import { MaxDistanceError } from '../errors/maxDistanceError'

let checkInsRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository

let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymRepository)

    await gymRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: null,

      latitude: -21.0135107,
      longitude: -48.2293391,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.0135107,
      userLongitude: -48.2293391,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 9, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.0135107,
      userLongitude: -48.2293391,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -21.0135107,
        userLongitude: -48.2293391,
      }),
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError)
  })

  it('should not be able check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 9, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.0135107,
      userLongitude: -48.2293391,
    })

    vi.setSystemTime(new Date(2023, 9, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.0135107,
      userLongitude: -48.2293391,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-21.1486047),
      longitude: new Decimal(-50.5434163),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -21.0135107,
        userLongitude: -48.2293391,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
