import eldeeb from '../index.js'
//nx: extend lib/index.js

eldeeb.data = function(root) {
  let data = require('./data.js').default
  return new data(root)
}

export default eldeeb //or: merge(eldeeb,overrides)
