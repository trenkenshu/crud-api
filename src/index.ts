import server from './server/server'
import * as dotenv from 'dotenv'

dotenv.config()

const port = Number(process.env.PORT);
server.listen(port, () => {
  console.log(`Running on port ${port}`)
})
