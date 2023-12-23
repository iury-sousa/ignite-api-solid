import 'dotenv/config'

import { randomUUID } from 'crypto'
import { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()

    const databaseURL = generateDatabaseURL(schema)
    process.env.DATABASE_URL = databaseURL

    console.log('database url', databaseURL)

    console.log('start executing migration')
    execSync('npx prisma migrate deploy')

    console.log('end executing migration')

    return {
      async teardown() {
        console.log('start drop database ', databaseURL)

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()

        console.log('end drop database ', databaseURL)
      },
    }
  },
}
