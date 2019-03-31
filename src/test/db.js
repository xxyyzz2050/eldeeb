const insert = false

var eldeeb = require('../lib/index.js')
//to see logs put options.debug=true (don't use eldeeb.op.log=true)
var options = require('../../eldeeb.config.js').db,
  wrongOptions = {
    //to test faild connection
    uri: 'mongodb://wrong-uri'
  }

eldeeb.db(
  'mongoDB',
  options,
  db => {
    db.on('all', ev => console.log('event2:', ev)) //db is connected & open, it will trigger only on other events, to listen to ALL events use events parameter
    console.log('uri:', db.uri)
    var { model: userModel, schema: userSchema } = db.model('users')

    /*
    console.log('model:', userModel)
    console.log('schema:', userSchema)
    */

    /*userModel
      .findOne()
      .then(
        data => console.log('findOne/data:', data),
        err => console.error('findOne/error:', err)
      )*/

    /*userModel.create({ name: 'test9' }).then(
      data => {
        console.log('creat/data: ', data)
        console.log('creat/data/id: ', data._id)
        userModel.findById(data._id).then(
          data => {
            console.log('find/data', data)
            console.log('find/data.toObject()', data.toObject())
          },
          err => console.log('find/err', err)
        )
      },
      err => console.error('create error:', err)
    )*/

    userModel.findById('5be92fb487e94116ac606ffe').then(
      data => {
        console.log('find/$id', data)
        console.log('find/$id/toObject', data.toObject())
        console.log(
          'find/$id/toObject->getters:true',
          data.toObject({ getters: true })
        )
      },
      err => console.error('find/$id', err)
    )

    userModel
      .findById('5be92fb487e94116ac606ffe')
      .lean()
      .then(
        data => console.error('find/$id/lean', data),
        err => console.error('find/$id/lean', err)
      )

    //--------/Queries----------//
  },
  err => console.log('err: ', err),
  ev => console.log('event:', ev)
)
