import { makeFetchUserCheckInsHistoryService } from '@/services/factories/makeFetchUserCheckInsHistoryService'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInsHistoryServic = makeFetchUserCheckInsHistoryService()

  const { checkIns } = await fetchUserCheckInsHistoryServic.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
