import { InMemoryCheckInsRepository } from '@/repositories/in-memory/inMemoryCheckInsRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryService } from '../fetchUserCheckInsHistory'

let checkInsRepository: InMemoryCheckInsRepository

let sut: FetchUserCheckInsHistoryService

describe('Fetch Check-in History Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let index = 0; index < 22; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-20' }),
      expect.objectContaining({ gym_id: 'gym-21' }),
    ])
  })
})
