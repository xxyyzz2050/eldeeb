eldeeb = require('../lib/')
eldeeb.op.log = false

try {
  throw eldeeb.error(0)
} catch (e) {
  console.log('err1: ', e)
}

try {
  eldeeb.error(0, true)
} catch (e) {
  console.log('err2: ', e)
}

try {
  throw new Error(eldeeb.error(0).msg)
} catch (e) {
  console.log('err3: ', e)
}

try {
  eldeeb.error('==error==', true)
} catch (e) {
  console.log('err4: ', e)
}
