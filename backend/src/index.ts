import { app } from "./app";

app.listen(3000);

console.log(
  `🦊 LogiAI API running at ${app.server?.hostname}:${app.server?.port}`,
);
