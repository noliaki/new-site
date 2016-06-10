const PRODUCTION = {
  ignoreErrors : false,
  sshConfig : {
    host       : 'HOSTNAME',
    port       : 22,
    username   : 'node',
    password   : 'password',
    privateKey : 'path/to/keyfile'
  },
  dest : '/path/to/dest'
};

const STAGING = {
  ignoreErrors : false,
  sshConfig : {
    host       : 'HOSTNAME',
    port       : 22,
    username   : 'node',
    password   : 'password',
    privateKey : 'path/to/keyfile'
  },
  dest : '/path/to/dest'
};

module.exports = {
  PRODUCTION,
  STAGING
}
