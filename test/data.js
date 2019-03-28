const eldeeb = require('../lib/index.js'),
  Path = require('path'),
  data = new (require('../lib/custom/data.js'))(),
  fs = require('fs')

eldeeb.op.log = true
process.env.NODE_ENV = 'development'

eldeeb.log(data.root, 'root')
eldeeb.log(data.cache('a/b/test.txt', 'OOOK'), 'mkdir')
