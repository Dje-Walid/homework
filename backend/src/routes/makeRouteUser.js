import yup from "yup"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { fileURLToPath } from "url"
import fs from "fs"
import path from "path"

const makeUser = ({ app }) => {
  const usersFilePath = path.resolve("./src/data/users.json")

  app.post(
    "/signIn",
    validate({
      body: {
        email: yup.string(),
        password: yup.string(),
      },
    }),
    mw(async (req, res) => {
      const { email, password } = req.body

      const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"))

      const user = users.find(user => user.email === email && user.password === password)

      if (user) {
        res.json(user)
      } else {
        res.status(401).json({ error: "Invalid email or password" })
      }
    }),
  )
}

export default makeUser
