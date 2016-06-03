const path      = require('path');
const pathEnv   = require('../configs/path-env.js');
const SITE_INFO = require('../configs/site-info.js');

module.exports = function(file) {
  const filePath = file.path.replace(pathEnv.src, '');
  const pathInfo = path.parse(filePath);
  pathInfo.ext = '.html';
  pathInfo.base = '';
  return {
    SITE_INFO,
    PAGE_INFO: {
      local_path: path.format(pathInfo),
      absolute_path: '//' + SITE_INFO.domain + path.format(pathInfo)
    }
  }
}
