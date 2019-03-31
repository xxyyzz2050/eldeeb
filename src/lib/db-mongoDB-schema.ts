import eldeeb from "./index.js";
import { Schema } from "mongoose";
eldeeb.options.mark = "db/mongoDB-schema";

export default class db_mongoDB_schema extends Schema {
  constructor(obj, options, indexes) {
    super(); //added temporary for typescript
    //console.log('==obj==', obj)
    return eldeeb.run("()", () => {
      /*
      nx: if(options.times){
        createdAt: { type: Date, default: Date.now },
        modifiedAt: { type: Date, default: Date.now },
      }
      */
      /*
      adjust adds properties 'after' creating mongoose.schema (ex: statics,methode,...)
      fields are added to obj (i.e before creating the schema)

      */
      obj = obj || {};
      options = options || {};
      //console.log('Options:', obj)
      if (eldeeb.objectType(obj) == "object") {
        if ("fields" in options) obj = eldeeb.merge(obj, options["fields"]);
        var adjust = options["adjust"] || {};
        delete options["fields"];
        delete options["adjust"];

        if (/*!('times' in obj) || */ obj.times === true || obj.times === 1) {
          obj.createdAt = { type: Date, default: Date.now };
          obj.modifiedAt = { type: Date, default: Date.now };
          delete obj.times;
        } else {
          if (obj.createdAt === true || obj.createdAt === 1)
            obj.createdAt = { type: Date, default: Date.now };
          if (obj.modifiedAt === true || obj.modifiedAt === 1)
            obj.modifiedAt = { type: Date, default: Date.now };
        }
        let defaultOptions = { strict: false };
        options = eldeeb.merge(defaultOptions, options);
        var schema = super(obj, options);
      } else {
        if (!(obj instanceof Schema)) return; //nx: add indexes & modify options
        super();
        var schema = obj; //nx: call super()?
      }

      if (adjust) {
        //deeply modify obj fields, allowing to create base obj and modify it for each schema
        for (let key in adjust) {
          if (eldeeb.objectType(adjust[key] == "object")) {
            for (let x in adjust[key]) {
              schema[key][x] = adjust[key][x];
            }
          } else schema[key] = adjust[key];
        }
      }

      //add indexes to schema, use this option to create indexes via autoIndex:true or model.createIndexes()
      //to create indexes without adding them to schama: eldeeb.db().index(model,indexes,options)

      if (indexes && indexes instanceof Array) {
        for (let i = 0; i < indexes.length; i++)
          if (indexes[i] instanceof Array)
            schema.index(indexes[i][0], indexes[i][1]);
          //[{fields},{options}]
          else schema.index(indexes[i]); //{fields}
      }

      return schema;
    });
  }
}
