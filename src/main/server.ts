import { MongoHelper } from '../infra/repositories/no-sql/helpers/mongo-helper'

import env from './config/env'

MongoHelper.connect(env.mongoUlr)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log(`server is running at http://localhost:${env.port}`))
  }).catch(console.error)
