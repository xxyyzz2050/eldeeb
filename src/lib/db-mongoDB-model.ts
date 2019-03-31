import eldeeb from "./index.js";
import { model as Model } from "mongoose";
eldeeb.options.mark = "db/mongoDB-model";

export default class db_mongoDB_model extends Model {
  constructor(public coll, public schema) {
    super(coll, schema);
    return this;
    //nx: test: this code changed from return super(..); https://stackoverflow.com/questions/26213256/ts2409-return-type-of-constructor-signature-must-be-assignable-to-the-instance
  }
}
