const browserSync = require('browser-sync').create()
const pathEnv = require('../configs/path-env.js')

const option = {
  server: {
    baseDir: pathEnv.dist
  },
  port: 3000,
  ghostMode: false,
  notify: false
}

module.exports = () => {
  browserSync.init(option)
}
