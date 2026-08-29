import { app } from './app'
import { env } from './config/env'

app.listen(env.PORT)
console.log(`LogiAI API running at http://localhost:${env.PORT}`)
