const path = require('path')
const pathEnv = require('../configs/path-env.js')
const SITE_CONF = require('../configs/site-config.js')

module.exports = (file) => {
  const filePath = file.path.replace(pathEnv.src, '')
  const pathInfo = path.parse(filePath)
  pathInfo.ext = '.html'
  pathInfo.base = ''
  return {
    SITE_CONF,
    PAGE_INFO: {
      local_path: path.format(pathInfo),
      absolute_path: '//' + SITE_CONF.domain + path.format(pathInfo)
    }
  }
}
