import fastify from 'fastify'
import fastifyJWT from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { usersRoutes } from './app/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import { gymsRoutes } from './app/controllers/gyms/routes'
import { checkInsRoutes } from './app/controllers/check-ins/routes'

export const app = fastify()

app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(402)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataLog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
