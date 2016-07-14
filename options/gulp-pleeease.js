const SITE_CONF = require('../configs/site-config.js');

module.exports = {
  minifier : false,
  mqpacker : true,
  import   : false,
  browsers : SITE_CONF.browsers
}
