// =============================================
// modules
//

// common
const path = require('path');

// =============================================
// path
//
const pathConfig = {
  src  : path.resolve('src'),
  dist : path.resolve('dist')
};

// =============================================
// config
//
module.exports = {

  // path
  path: {
    src  : pathConfig.src,
    dist : pathConfig.dist
  },

  // serve
  browserSync: {
    server: {
      baseDir: pathConfig.dist
    },
    port: 3000,
    ghostMode: false,
    notify: false
  },

  // pug
  pug: {
    pretty: true,
    basedir: pathConfig.src
  },
  data: function(file) {
    const filePath = file.path.replace(pathConfig.src, '');
    const pathInfo = path.parse(filePath);
    pathInfo.ext = '.html';
    pathInfo.base = '';
    return {
      path: path.format(pathInfo)
    }
  },

  // styles
  sass: {
    outputStyle: 'compressed'
  },
  autoprefixer: {
    browsers: [
      '> 1% in JP'     ,
      'last 2 versions',
      'ie >= 7'        ,
      'last 2 Firefox versions'
    ]
  },

  // scripts
  uglify: {
    preserveComments: 'some'
  },
  babel: {
    presets: ['es2015']
  },

  // images
  imagemin: {
  }
};
