"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const shortId_1 = require("shortId");
const index_js_1 = __importDefault(require("./index.js"));
let eldeeb = new index_js_1.default({
    mark: "db/mongoDB"
});
class db_mongoDB {
    constructor(options, done, fail, events) {
        return eldeeb.run(["()", options], () => {
            this.promise = eldeeb.promise((resolve, reject) => {
                let err = eldeeb.error(100), defaultOptions = {
                    useCreateIndex: true,
                    useFindAndModify: false,
                    bufferCommands: false,
                    autoIndex: false,
                    retryWrites: true
                };
                if (typeof options == "function")
                    options = options();
                if (eldeeb.isEmpty(options))
                    reject(Object.assign({}, err, { details: {
                            uri: this.uri,
                            error: "options is empty",
                            options: options
                        } }));
                else if (typeof options == "string")
                    options = { uri: options };
                else if (options instanceof Array) {
                    options = {
                        user: options[0],
                        pass: options[1],
                        host: options[2],
                        db: options[3]
                    };
                }
                if (eldeeb.objectType(options) != "object")
                    reject(Object.assign({}, err, { details: {
                            uri: this.uri,
                            error: "options is not an object",
                            options: options
                        } }));
                if (typeof options.uri == "function")
                    options.uri = options.uri(options);
                if ("uri" in options && !eldeeb.isEmpty(options.uri)) {
                    this.uri =
                        (options.uri.substr(0, 7) != "mongodb"
                            ? "mongodb" + (options.srv ? "+srv" : "") + "://"
                            : "") + options.uri;
                }
                else {
                    if (!("user" in options) ||
                        !("pass" in options) ||
                        eldeeb.isEmpty(options.user) ||
                        eldeeb.isEmpty(options.pass))
                        reject(Object.assign({}, err, { details: {
                                uri: this.uri,
                                error: "no uri or user/pass",
                                options: options
                            } }));
                    if (!options["host"])
                        options["host"] = "localhost";
                    this.uri = `mongodb${options.srv ? "+srv" : ""}://${this.encode(options["user"])}:${this.encode(options["pass"])}@${options["host"] instanceof Array
                        ? options["host"].join(",")
                        : options["host"]}/${options["db"]}`;
                }
                this.models = options.models ? options.models : "../../../models";
                this.ext = options.ext ? options.ext : "json";
                if (options.debug) {
                    mongoose.set("debug", true);
                    eldeeb.options.log = true;
                }
                else {
                    mongoose.set("debug", false);
                    eldeeb.options.log = false;
                }
                delete options["uri"];
                delete options["user"];
                delete options["pass"];
                delete options["host"];
                delete options["db"];
                delete options["options"];
                delete options["models"];
                delete options["ext"];
                delete options["debug"];
                delete options["srv"];
                if (options.pk) {
                    this.pk == options.pk;
                    delete options.pk;
                }
                else
                    this.pk == "__id";
                options = eldeeb.merge(defaultOptions, options);
                this.connection = mongoose.createConnection(this.uri, options);
                if (!this.connection)
                    reject(Object.assign({}, err, { details: {
                            uri: this.uri,
                            error: "connection error",
                            options: options
                        } }));
                if (events)
                    this.on("all", ev => events(ev));
                this.connection.then(() => resolve(this), error => reject(Object.assign({}, err, { details: { uri: this.uri, error: error, options: options } })));
            }, done, fail);
            return this.promise;
        });
    }
    connect(options, done, fail) {
        return eldeeb.run(["connect", options], () => {
            return new db_mongoDB(options, done, fail);
        });
    }
    encode(str) {
        return encodeURIComponent(str).replace(/%/g, "%25");
    }
    on(event, callback, once) {
        return eldeeb.run(once ? "once" : "on", () => {
            if (this.connection) {
                let ev = once ? this.connection.once : this.connection.on;
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
                        ev.call(this.connection, event[i], function () {
                            callback(event[i]);
                        });
                    }
                }
                else
                    ev.call(this.connection, event, callback);
            }
            return this;
        });
    }
    once(event, callback) {
        return this.on(event, callback, true);
    }
    schema(obj, options, indexes) {
        return eldeeb.run("schema", () => {
            obj = obj || {};
            options = options || {};
            let schema, adjust = options["adjust"] || {};
            delete options["adjust"];
            if (obj)
                schema = obj;
            else {
                if ("fields" in options)
                    obj = eldeeb.merge(obj, options["fields"]);
                delete options["fields"];
                if ("times" in obj && obj.times !== false) {
                    if (eldeeb.objectType(obj.times) !== "array")
                        obj.times = [
                            obj.times,
                            obj.times
                        ];
                    if (!("createdAt" in obj) && obj.tomes[0] !== false) {
                        obj.createdAt = {
                            type: Date,
                            default: obj.times[0] === true ? Date.now : obj.tomes[0]
                        };
                    }
                    if (!("modifiedAt" in obj) && obj.tomes[1] !== false) {
                        obj.modifiedAt = {
                            type: Date,
                            default: obj.times[1] === true ? Date.now : obj.tomes[1]
                        };
                    }
                    delete obj.times;
                }
                options = eldeeb.merge({ strict: false }, options);
                schema = new mongoose.Schema(obj, options);
            }
            if (adjust) {
                for (let key in adjust) {
                    if (eldeeb.objectType(adjust[key] == "object")) {
                        for (let x in adjust[key]) {
                            schema[key][x] = adjust[key][x];
                        }
                    }
                    else
                        schema[key] = adjust[key];
                }
            }
            if (indexes && indexes instanceof Array) {
                for (let i = 0; i < indexes.length; i++)
                    if (indexes[i] instanceof Array)
                        schema.index(indexes[i][0], indexes[i][1]);
                    else
                        schema.index(indexes[i]);
            }
            return schema;
        });
    }
    db_mongoDB_model(coll, schema, options, indexes) {
        if (!this.connection)
            return { model: null, schema: null };
        return eldeeb.run(["model", schema, options], () => {
            if (typeof schema == "string")
                schema = require(schema) || {};
            else if (schema == null || typeof schema == "undefined") {
                schema = require(`${this.models}/${coll}.${this.ext}`) || {};
            }
            if (!(schema instanceof mongoose.Schema)) {
                options = options || {};
                if (!("collection" in options))
                    options["collection"] = coll;
                schema = this.schema(schema, options, indexes);
            }
            return { model: this.connection.model(coll, schema), schema: schema };
        });
    }
    createIndex(model, index, options) {
        let defaultOptions = {};
        options = eldeeb.merge(defaultOptions, options);
        if (index instanceof Array) {
            let r = [];
            for (let i = 0; i < index.length; i++) {
                if (index[i] instanceof Array)
                    return this.createIndex(model, index[i][0], index[i][1]);
                else
                    return this.createIndex(model, index[i][0], options);
            }
            return r;
        }
        return model.collection.createIndex(index, options);
    }
    index(model, index, options) {
        return this.createIndex(model, index, options);
    }
    set(key, value) {
        if (eldeeb.objectType(key) == "object") {
            for (var k in key)
                this.set(k, key[k]);
        }
        if (key == "models")
            this.models = value;
        else
            mongoose.set(key, value);
    }
    select() {
    }
    get() { }
    shortId() {
        return shortId_1.generate();
    }
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
                                { $eq: ["$$this", ""] },
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
        return array;
    }
}
exports.default = db_mongoDB;
//# sourceMappingURL=db-mongoDB.js.map