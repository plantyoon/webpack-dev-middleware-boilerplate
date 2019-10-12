console.clear()

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackConfig = require('../webpack.config')
const compiler = webpack(webpackConfig)

const express = require('express')
const app = express()

const color = require('./escape-color')

const {getPort, checkPort} = require('./get-port')

const DEFAULT_PORT = 8080

function getPropPort() {
  if (process.argv.indexOf('-p') === -1) return 0
  else return Number(process.argv[process.argv.indexOf('-p') + 1])
}

function runDevServer(app, port) {
  app.use(
    webpackDevMiddleware(compiler, {
      stats: 'minimal'
    })
  )
  
  app.use(
    webpackHotMiddleware(compiler)
  )

  app.listen(port);
}

const main = async () => {
  let port = getPropPort() ? getPropPort() : DEFAULT_PORT

  try {
    await checkPort(port)
  } catch (e) {
    console.log(color('yellow')(`Warning: listen EADDRINUSE: address already in use :::${port}\n`))
    port = await getPort()
  }
  runDevServer(app, port)

  compiler.hooks.done.tap('ProgressPlugin', (context, entry) => {
    console.clear()
    console.log(`\nServer running at : ${color('green,underline')(`http://localhost:${port}`)}\n`)
  });
}
main()