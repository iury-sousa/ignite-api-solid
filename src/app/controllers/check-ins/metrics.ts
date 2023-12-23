import { makeGetUserMetricsService } from '@/services/factories/makeGetUserMetricsService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsService = makeGetUserMetricsService()

  const { checkInsCount } = await getUserMetricsService.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
