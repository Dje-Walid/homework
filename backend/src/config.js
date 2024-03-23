import "dotenv/config"
import * as yup from "yup"

const validationConfigSchema = yup.object().shape({
  port: yup.number().min(80).max(65535).required(),
})

let config = null

try {
  config = validationConfigSchema.validateSync({
    port: process.env.PORT,
  })
} catch (error) {
  // eslint-disable-next-line no-console
  throw new Error(`Invalid config params :  ${error.errors.join("\n- ")}
`)
}

export default config