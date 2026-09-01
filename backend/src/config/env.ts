import { type Static, t } from "elysia";

const envSchema = t.Object({
  DATABASE_URL: t.String(),
  PORT: t.Numeric(),
});

type Env = Static<typeof envSchema>;
export const env = Bun.env as unknown as Env;
