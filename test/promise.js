var eldeeb = require('../lib/'),
  promise = eldeeb.promise()

eldeeb.op.log = false

//nx: wait()=>clearTimeout

promise
  .then(() => console.log('start...'))
  .wait(1, timeout => console.log('wait(): ', timeout.seconds)) //excuted after .when() ??
  .wait(1.5, timeout => {
    console.log('clearing timeout..')
    clearTimeout(timeout) //wrong:because it waits until setTimeout finsih
  })

  .when(true, x => console.log('when(true): ', x)) //inline then()
  .then() //empty then ignored
  .when(function(resolve) {
    resolve('OK')
  })
  .then(x => console.log('when(function): ', x)) //separated then
  .done(x => console.log('done: ', x))
  .when(
    function() {
      return 'using return' //not work -> promise must be resolved or rejected
    },
    x => console.log(x),
    err => console.error(err)
  )
  .done(x => console.log(x))
  .catch(e => console.error(e))

//######## promise.all()
//inline .then() & using .promise ->correct

//inline .then()
promise.all(
  [promise.wait(1), promise.wait(2), true],
  values => console.log('all/inline: ', [values[0].seconds, values[1].seconds]),
  e => console.log('all/fail: ', e)
)
//separated .then()
promise
  .all([promise.wait(1), promise.wait(2), true])
  .then(values =>
    console.log('all/separated: ', [values[0].seconds, values[1].seconds])
  ) //correct

eldeeb
  .promise([promise.wait(1), promise.wait(2), 1], v => {
    console.log('v1', v)
    return 'OK'
  }) //in;ine .then() dosent work
  .then(v => console.log('v2', v))
