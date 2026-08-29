import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().default('postgresql://logiai:logiai@localhost:5432/logiai'),
  PORT: z.coerce.number().int().positive().default(3000),
})

export const env = envSchema.parse({ DATABASE_URL: process.env.DATABASE_URL, PORT: process.env.PORT })
