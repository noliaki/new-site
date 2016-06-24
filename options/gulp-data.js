const path      = require('path');
const yaml      = require('js-yaml');
const fs        = require('fs');

const pathEnv   = require('../configs/path-env.js');
const SITE_INFO = require('../configs/site-info.js');

const ja_yml = fs.readFileSync('./configs/locals/ja.yml', 'utf8')
const en_yml = fs.readFileSync('./configs/locals/en.yml', 'utf8')

module.exports = (file) => {
  const lang = file.path.indexOf('/en/') >= 0 ? 'en' : 'ja';
  const filePath = file.path.replace(pathEnv.src, '');
  const pathInfo = path.parse(filePath);
  pathInfo.ext = '.html';
  pathInfo.base = '';

  const dictionary = yaml.safeLoad( lang === 'en' ? en_yml : ja_yml )

  return {
    SITE_INFO,
    PAGE_INFO: {
      local_path: path.format(pathInfo),
      absolute_path: '//' + SITE_INFO.domain + path.format(pathInfo),
      lang
    },
    dictionary
  }
}
