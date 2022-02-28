import express, { urlencoded, json } from 'express'

import router from './routes/index'

const app = express()

app.use(
  urlencoded({
    extended: true,
  }),
)

app.use(json())

app.use('/', router)

app.listen(3000, () => console.log('App listening on port 3000'))
