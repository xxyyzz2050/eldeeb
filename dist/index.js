"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
class default_1 {
    constructor(options) {
        this.options = options;
        let defaultOptions = {
            log: false,
            minLogLevel: "log",
            debug: false,
            mark: ""
        };
        this.options = this.merge(defaultOptions, options);
    }
    run(mark, fn, isPromise) {
        if (this.options.debug)
            debugger;
        if (typeof fn != "function") {
            if (this.options.log)
                console.warn("eldeeb run: not a function ", mark, fn);
            return;
        }
        if (typeof mark == "string")
            mark = (this.options.mark != "" ? this.options.mark + "/" : "") + mark;
        else if (mark instanceof Array)
            mark[0] =
                (this.options.mark != "" ? this.options.mark + "/" : "") + mark[0];
        else if (this.objectType(mark) == "object" && mark.run)
            mark.run =
                (this.options.mark != "" ? this.options.mark + "/" : "") + mark.run;
        if (!isPromise) {
            try {
                let f = fn();
                if (mark && this.options.log)
                    console.log("success: eldeeb:", mark, f);
                return f;
            }
            catch (e) {
                this.err(e, mark, fn);
            }
        }
        else {
            let promise = new Promise(fn);
            if (mark && this.options.log)
                console.log("promise: eldeeb:", mark, promise);
            return promise;
        }
    }
    err(e, at, extra) {
        console.error(`Error @eldeeb: ${at} ${e.name}${e.message ? ": " + e.message : e.description ? ": " + e.description : ""}\n${e.lineNumber ? " @" + e.lineNumber + " in" + e.fileName + "\n" : ""}${e.stack ? e.stack : ""}\n->`, extra ? extra : "");
    }
    log(obj, mark, type) {
        if (!this.options.log || process.env.NODE_ENV != "development")
            return;
        mark = mark || "";
        type = type || mark == "error" ? "error" : "log";
        obj = util_1.default.inspect(obj, {
            maxArrayLength: null,
            depth: null,
            colors: true,
            breakLength: 100
        });
        if (typeof mark == "string")
            mark = (this.options.mark != "" ? this.options.mark + "/" : "") + mark;
        else if (mark instanceof Array)
            mark[0] =
                (this.options.mark != "" ? this.options.mark + "/" : "") + mark[0];
        console[type](`---\n ${mark}:\n`, obj, "\n---");
    }
    now() {
        return Math.round(new Date().getTime());
    }
    isArray(obj) {
        return (obj &&
            (obj instanceof Array ||
                (typeof obj != "string" && typeof obj[Symbol.iterator] == "function")));
    }
    inArray(el, arr, sensitive) {
        return this.run({ run: "eldeeb/inArray", el, arr, sensitive }, () => {
            if (!sensitive && typeof el == "string")
                el = el.toLowerCase();
            if (this.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (!sensitive && typeof arr[i] == "string")
                        arr[i] = arr[i].toLowerCase();
                    if (arr[i] == el)
                        return true;
                }
            }
            else if (typeof arr == "object")
                return el in arr;
            else if (typeof arr == "string")
                return arr.indexOf(el);
        });
    }
    sleep(seconds) {
        if (!seconds)
            seconds = 2;
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
    df(x, y) {
        return typeof x == "undefined" ? y : x;
    }
    objectType(obj) {
        return Object.prototype.toString
            .call(obj)
            .replace("[object ", "")
            .replace("]", "")
            .toLowerCase();
    }
    isEmpty(obj) {
        return typeof obj == "undefined" || this.inArray(obj, ["", null, [], {}]);
    }
    merge(target, ...obj) {
        return this.run(["merge", target, ...obj], function () {
            let type = this.objectType(target);
            for (var i = 1; i < arguments.length; i++) {
                if (this.objectType(arguments[i]) !== type)
                    return target;
            }
            if (type == "array") {
                target = target.concat(...obj);
            }
            else if (type == "object") {
                for (var i = 1; i < arguments.length; i++) {
                    for (var p in arguments[i]) {
                        target[p] = arguments[i][p];
                    }
                }
            }
            else if (type == "class") {
            }
            return target;
        });
    }
    json(data) {
        if (typeof data == "string") {
            if (data.trim().charAt(0) == "{")
                return JSON.parse(data);
            if (data
                .split(".")
                .pop()
                .toLowerCase() == "json")
                return require(data);
            data = require("fs").readFileSync(data);
            return JSON.parse(data);
        }
        else
            return JSON.stringify(data);
    }
    db(type, options, done, fail, events) {
        if (typeof type == "undefined" || type == "mongo" || type == "mongoose")
            type = "mongoDB";
        let db = require(`./db-${type}.js`).default;
        return new db(options, done, fail, events);
    }
    promise(fn, done, failed) {
        let promise = require("./promise.js").default;
        return new promise(fn, done, failed);
    }
    when(fn, done, failed) {
        return this.promise(fn, done, failed);
    }
    error(error, throwError, jsError) {
        let err = require("./error.js").default;
        return new err(error, throwError, jsError);
    }
    data(root) {
        let data = require("./data.js").default;
        return new data(root);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map