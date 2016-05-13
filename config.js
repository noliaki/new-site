// =============================================
// require module
//
const path = require('path');

// =============================================
// require site information
//
const SITE_INFO = require('./site_info.js');

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
  SITE_INFO,

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
    port      : 3000,
    ghostMode : false,
    notify    : false
  },

  // pug
  pug: {
    pretty  : true,
    basedir : pathConfig.src
  },

  // data
  data: function(file) {
    const filePath = file.path.replace(pathConfig.src, '');
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
  },

  // styles
  sass: {
    outputStyle: 'expanded'
  },
  autoprefixer: {
    browsers: [
      '> 1% in JP'     ,
      'last 2 versions',
      'ie >= 8'
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
