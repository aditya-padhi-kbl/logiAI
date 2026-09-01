import { app } from "./app";
import { env } from "elysia";

app.listen(env.PORT);
console.log(`LogiAI API running at http://localhost:${env.PORT}`);
