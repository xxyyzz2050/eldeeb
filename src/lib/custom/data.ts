import Data from '../data.js'
export default class data extends Data {
  constructor(root) {
    root = root || '' //nx: the root path of the project
    super(root) //nx: test if root is the path of this file or the parent file (i.e lib/data.js)
  }

  cache(file, data, expire, type, allowEmpty) {
    return super.cache('tmp/' + file, data, expire, type, allowEmpty)
  }
}
