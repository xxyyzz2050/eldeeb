import eldeeb from "./index.js";
import mongoose from "mongoose";
import schema from "./db-mongoDB-schema.js";
import model from "./db-mongoDB-Model.js";
import { generate as shortId } from "shortId";

eldeeb.options.mark = "db/mongoDB";

export default class db_mongoDB /* extends mongoose.constructor*/ {
  //mongoose/lib/index.js exports new mongoose(), not the class itself; also mongoose is a Function

  private promise;
  public connection;
  public models;
  public ext;
  public pk;
  public uri;
  constructor(options, done?, fail?, events?) {
    //nx: return Promise
    //note: if this class didn't extends mongoose, 1- don't use super() 2- use mongoose instead of this to access mongoose properties
    //when extends
    //super(options)
    return eldeeb.run(["()", options /*,callback*/], () => {
      this.promise = eldeeb.promise(
        (resolve, reject) => {
          let err = eldeeb.error(100),
            defaultOptions = {
              useCreateIndex: true,
              //useNewUrlParser: true, //https://mongoosejs.com/docs/deprecations.html; now it gives "MongoError: authentication fail"
              useFindAndModify: false,
              bufferCommands: false, //https://mongoosejs.com/docs/connections.html
              autoIndex: false,
              retryWrites: true
            };

          if (typeof options == "function") options = options();
          if (eldeeb.isEmpty(options))
            reject({
              ...err,
              details: {
                uri: this.uri,
                error: "options is empty",
                options: options
              }
            });
          else if (typeof options == "string") options = { uri: options };
          else if (options instanceof Array) {
            //don't use typeof options=="Array"
            options = {
              user: options[0],
              pass: options[1],
              host: options[2],
              db: options[3]
            };
          }

          if (eldeeb.objectType(options) != "object")
            reject({
              ...err,
              details: {
                uri: this.uri,
                error: "options is not an object",
                options: options
              }
            });

          if (typeof options.uri == "function")
            options.uri = options.uri(options);

          if ("uri" in options && !eldeeb.isEmpty(options.uri)) {
            this.uri =
              (options.uri.substr(0, 7) != "mongodb"
                ? "mongodb" + (options.srv ? "+srv" : "") + "://"
                : "") + options.uri;
          } else {
            if (
              !("user" in options) ||
              !("pass" in options) ||
              eldeeb.isEmpty(options.user) ||
              eldeeb.isEmpty(options.pass)
            )
              reject({
                ...err,
                details: {
                  uri: this.uri,
                  error: "no uri or user/pass",
                  options: options
                }
              });
            if (!options["host"]) options["host"] = "localhost"; //nx: default port
            // if(!("db" in options))options["db"]="database"
            this.uri = `mongodb${options.srv ? "+srv" : ""}://${this.encode(
              options["user"]
            )}:${this.encode(options["pass"])}@${
              options["host"] instanceof Array
                ? options["host"].join(",")
                : options["host"]
            }/${options["db"]}`; //?${options["options"]
          }

          this.models = options.models ? options.models : "../../../models"; //default path for model schema objects (related to THIS file)
          this.ext = options.ext ? options.ext : "json";
          if (options.debug) {
            mongoose.set("debug", true);
            eldeeb.options.log = true;
          } else {
            mongoose.set("debug", false);
            eldeeb.options.log = false; //default is true
          }
          delete options["uri"];
          delete options["user"];
          delete options["pass"];
          delete options["host"];
          delete options["db"];
          delete options["options"]; //deprecated: options for native dbMongo (appended to uri ->uri?options)
          delete options["models"];
          delete options["ext"];
          delete options["debug"];
          delete options["srv"];
          //options may has another properties for Mongoose or mongoDB, so don't set options to null

          if (options.pk) {
            this.pk == options.pk;
            delete options.pk;
          } else this.pk == "__id";

          options = eldeeb.merge(defaultOptions, options);
          //if (eldeeb.options.log)  console.log('connection details:', this.uri, options)

          this.connection = mongoose.createConnection(this.uri, options);
          if (!this.connection)
            reject({
              ...err,
              details: {
                uri: this.uri,
                error: "connection error",
                options: options
              }
            });
          if (events) this.on("all", ev => events(ev)); //this will be run for all events, .then(..db.on('all')) will be run for all events AFTER 'open' because .then() only occurs after 'open' stage
          this.connection.then(
            () => resolve(this), //db is connected & open, using .on() will be run on other events
            error =>
              reject({
                ...err,
                details: { uri: this.uri, error: error, options: options }
              })
          ); //after mongoose.createConnection() response, resolve/reject this promise
          //the error occures on mongoose, not mongoDB, success here doesn't mean we have a success connection to the real database
          //mongoose.connect() is the default connection using .createConnection, here every instance has only one connection

          // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
          //nx: needs review
          //nx: return a promise.resolve(this,status) ,on('error',reject(e))
        },
        done, //nx: pass this.connection to done()
        fail
      );

      return this.promise;
    }); //run
  }

  connect(options, done, fail) {
    //this function just creats a new instance of this class
    return eldeeb.run(["connect", options /*,callback*/], () => {
      return new db_mongoDB(options, done, fail);
    });
  }

  encode(str) {
    return encodeURIComponent(str).replace(/%/g, "%25");
  }

  on(event, callback, once?: boolean) {
    /*
    ev(event,callback) will not work because it cantains "this" whitch refers to this.connection, not to this class
    so we use ev.call() to change the context to this.connection
   */ return eldeeb.run(
      once ? "once" : "on",
      () => {
        if (this.connection) {
          let ev = once ? this.connection.once : this.connection.on;
          //console.log('==ev==', ev)
          //console.log('==this==', this.connection)
          //console.log(ev('error')); //OK gives mongooseError
          //console.log('conn:', this.connection) //OK
          //console.log('ev:', this.connection.on('error', function() {})) //error!
          if (event == "all")
            event = [
              "connected",
              "disconnected",
              "reconnected",
              "connecting",
              "reconnecting",
              "disconnecting",
              "index",
              "close",
              "error",
              "open"
            ];
          if (event instanceof Array) {
            for (let i = 0; i < event.length; i++) {
              //nx: useing var instead of let gives a wrong (i) inside function(){..}, why?
              ev.call(this.connection, event[i], function() {
                callback(event[i]);
              });
            }
          } else ev.call(this.connection, event, callback); //nx: if once .once(..)
        }
        return this; //chaining this function will NOT wait it to finish, so on(error,fn).on(open,fn) will work fine
      }
    );
  }

  once(event, callback) {
    return this.on(event, callback, true);
  }
  schema(obj, options, indexes) {
    return new schema(obj, options, indexes); //mongoose.Schema(...)
  }

  model(coll, schema, options, indexes) {
    //nx: field: anotherSchema ??
    if (!this.connection) return { model: null, schema: null };
    return eldeeb.run(["model", schema, options], () => {
      if (typeof schema == "string") schema = require(schema) || {};
      else if (schema == null || typeof schema == "undefined") {
        schema = require(`${this.models}/${coll}.${this.ext}`) || {};
      }

      if (!(schema instanceof mongoose.Schema)) {
        options = options || {};
        if (!("collection" in options)) options["collection"] = coll;
        schema = this.schema(schema, options, indexes);
      }

      return { model: this.connection.model(coll, schema), schema: schema }; //var {model,schema}=db.model(..); or {model:MyModel,schema:mySchema}=db.model(..) then: schema.set(..)
      //nx: override mongoose.model
      //don't use $super(model) because it referce to the default connection created by mongoose.connect(), not the current connection
    });
  }

  createIndex(model, index, options) {
    //nx: if(model:object)model=this.model(model); nx: directly use mongoDB
    //if schema contains indexes (schema.index()), use autoIndex:true or model.createIndexes()
    //use this function to create indexes that is not defined in the schema
    // model.collection perform native mongodb queries (not mongoose queries)
    let defaultOptions = {
      /*name:'index'*/
    }; //index name must be unique accross the table
    options = eldeeb.merge(defaultOptions, options);
    if (index instanceof Array) {
      let r = [];
      for (let i = 0; i < index.length; i++) {
        if (index[i] instanceof Array)
          return this.createIndex(model, index[i][0], index[i][1]);
        //or merge(options,index[i][1])
        else return this.createIndex(model, index[i][0], options);
      }
      return r;
    }
    return model.collection.createIndex(index, options); //promise
    /*
      eldeeb.promise(model.collection.createIndex(indexes, options),x=>x,err=>console.error(err))
      return this
      */
  }
  index(model, index, options) {
    return this.createIndex(model, index, options);
  }

  set(key, value) {
    if (eldeeb.objectType(key) == "object") {
      for (var k in key) this.set(k, key[k]);
    }
    if (key == "models") this.models = value;
    else mongoose.set(key, value);
  }

  //nx: move to mongoose-model() extends mongoose.model
  select() {
    //aggregate=select([stages])
  }

  get() {}

  shortId() {
    return shortId();
  }

  //----------------------- aggregation helpers -> move to class aggregate ------------------------ //
  replace(entry, oldString, newString) {
    return {
      $trim: {
        input: {
          $reduce: {
            input: {
              $split: [entry, oldString]
            },
            initialValue: "",
            in: {
              $cond: [
                { $eq: ["$$this", ""] }, //nx: or null
                "$$value",
                { $concat: ["$$value", newString, "$$this"] }
              ]
            }
          }
        },
        chars: newString
      }
    };
  }

  implode(array, delimeter) {
    delimeter = delimeter || ",";
    return array; //nx: return a string of elements separated by the delimeter
  }
  //----------------------- /aggregation helpers ------------------------ //
}
