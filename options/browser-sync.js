const pathEnv = require('../configs/path-env.js');

module.exports = {
  server : {
    baseDir : pathEnv.dist
  },
  port      : 3000,
  ghostMode : false,
  notify    : false
}
