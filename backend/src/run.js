import cors from "cors"
import express from "express"
import handleError from "./middlewares/handleError.js"
import makeUser from "./routes/makeRouteUser.js"
import makeVm from "./routes/makeRouteVM.js"

const run = async (config) => {
  const app = express()
  app.use(cors())
  app.use(express.json())

  makeUser({ app })
  makeVm({ app })

  app.use(handleError)
  // handling 404: keep it always LAST!
  app.use((req, res) => {
    res.status(404).send({ error: [`cannot POST ${req.url}`] })
  })

  // eslint-disable-next-line no-console
  app.listen(config.port, () => console.log(`Listening on :${config.port}`))
}

export default run
