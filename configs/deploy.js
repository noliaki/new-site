const fs = require('fs');

const production = {
  ignoreErrors : false,
  sshConfig : {
    host       : 'HOST NAME',
    port       : 22,
    username   : 'USERNAME',
    password   : 'PASSWORD',
    privateKey : '/path/to/private-key' //fs.readFileSync('/path/to/private-key')
  },
  dest : '/path/to/deploy/production'
};

const staging = {
  ignoreErrors : false,
  sshConfig : {
    host       : 'HOST NAME',
    port       : 22,
    username   : 'USERNAME',
    password   : 'PASSWORD',
    privateKey : '/path/to/private-key' //fs.readFileSync('/path/to/private-key')
  },
  dest : '/path/to/deploy/staging'
};

module.exports = {
  production,
  staging
}
