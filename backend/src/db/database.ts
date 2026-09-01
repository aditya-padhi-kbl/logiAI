import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { Database } from "./types";
import { env } from "../config/env";
const { Pool } = pg;
const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});
