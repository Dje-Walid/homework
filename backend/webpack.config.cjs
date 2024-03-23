const nodeExternals = require("webpack-node-externals")

module.exports = {
  mode: "production",
  entry: "./index.js",
  target: "node",
  externals: [nodeExternals()],
  externalsPresets: {
    node: true,
  },
}
