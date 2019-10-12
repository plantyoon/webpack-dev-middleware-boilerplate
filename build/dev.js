console.clear()

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackConfig = require('../webpack.config')
const compiler = webpack(webpackConfig)

const path = require('path')

const express = require('express')
const app = express()

const color = require('./escape-color')

const {getPort, checkPort} = require('./get-port')

const DEFAULT_PORT = 8080

/**
 * Run HMR Dev Server
 * @param {import('express')} app 
 * @param {number} port 
 */
function runDevServer(app, port) {
  app.use(
    webpackDevMiddleware(compiler, {
      stats: 'minimal'
    })
  )
  
  app.use(
    webpackHotMiddleware(compiler)
  )

  app.use('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath,'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  });

  app.listen(port);
}

const main = async () => {
  let port = DEFAULT_PORT

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