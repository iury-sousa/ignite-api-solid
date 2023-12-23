import { InMemoryGymsRepository } from '@/repositories/in-memory/inMemoryGymsRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymService } from '../createGym'

let gymRepository: InMemoryGymsRepository
let createGymService: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    createGymService = new CreateGymService(gymRepository)
  })

  it('should be able to register', async () => {
    const { gym } = await createGymService.execute({
      title: 'Javascrip Gym',
      latitude: -21.0135107,
      longitude: -48.2293391,
      description: null,
      phone: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
