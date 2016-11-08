const pathEnv = require('../configs/path-env.js');

exports.pug = {
  extension: 'pug',
  regexp: /^\s*(?:include|extends)\s+(.+)/,
  rootPath: pathEnv.src
}

exports.sass = {}
