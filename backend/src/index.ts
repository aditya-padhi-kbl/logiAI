import { app } from "./app";
import { env } from "./config/env";
import { checkDatabaseConnection } from "./db/database";

app.listen(env.PORT, () => {
  console.log(`LogiAI API running at http://localhost:${env.PORT}`);
  checkDatabaseConnection();
});
