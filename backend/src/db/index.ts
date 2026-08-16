import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env";
import * as schema from "./schema";
const db = drizzle(env.DATABASE_URL, { logger: true, schema });
export default db;
