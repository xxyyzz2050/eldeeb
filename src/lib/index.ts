import util from "util";

//todo: dynamically import types
//todo: export * as promiseTypes from "./promise"; in draft mode: https://github.com/leebyron/ecmascript-more-export-from#proposed-additions
import * as promiseTypes from "./promise";
import * as errorTypes from "./error";

//console.log('util:', util) //using require&module.exports will prevent this line from calling when run via localhost (called when run via cmd) ,the problem is in : eldeeb/index/isArray->Symbol.iterator, adding quotes will fix it obj['Symbol.iterator'] but it will return a wrong value; may be the error is by Nuxt or babel
export default {
  options: {
    //options
    log: false, //nx: min log level
    minLogLevel: "log", //log,warn,error (verbose)
    debug: false,
    mark: "" //mark prefix
  },
  promiseTypes, //or types: { promiseTypes, errorTypes },
  errorTypes,

  mode(mode: string) {
    if (mode == "dev") mode = "development";
    return mode ? process.env.NODE_ENV == mode : process.env.NODE_ENV;
  },
  run: function(mark?: any, fn?: () => any, isPromise?: boolean) {
    //nx: create function overloads
    //always use arrow function to keep "this" referce to the original function context (not "run()" context)
    //nx: mark="eldeeb:"+this.run.caller (not allowed in strict mode), https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee
    /*
     if fn returns a value, you mast return this.run()
     ex: function test(){
           return eldeeb.run("test",function(){return 123});
         }
         alert(test()); //123

         nx: to use await pass async fn, ex: this.run(async fn(){await sleep(1); alert(1);});
    */

    /*if (typeof promise == "function") {
      fn = promise;
      promise = false;
    } else if (typeof mark == "function") {
      fn = mark;
      mark = "";
      //  promise=false
    }*/

    if (this.options.debug) debugger;
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

    if (!isPromise) {
      try {
        let f = fn();
        if (mark && this.options.log) console.log("success: eldeeb:", mark, f);
        return f;
      } catch (e) {
        this.err(e, mark, fn);
      }
    } else {
      let promise = new Promise(fn); //fn must resolve the promise, fn(resolve,reject){if(finished)resolve(value)}
      if (mark && this.options.log)
        console.log("promise: eldeeb:", mark, promise /*, fn*/);
      return promise;
    }
    //note that any console.log() inside fn() will appear BEFORE console.log("Success:**"), success must be at the end of try{}
    //don't concatenate mark (or other objects) to expand them to show their properties (concatenation will cast it to string)
  },
  err: function(e: any, at?: number | string, extra?: any) {
    //todo: e:Error
    //  if (typeof at == "undefined") at = "eldeeb.js";
    console.error(
      `Error @eldeeb: ${at} ${e.name}${
        e.message ? ": " + e.message : e.description ? ": " + e.description : ""
      }\n${
        e.lineNumber ? " @" + e.lineNumber + " in" + e.fileName + "\n" : ""
      }${e.stack ? e.stack : ""}\n->`,
      extra ? extra : ""
    );
    //console.error("Error @eldeeb: " + at + "(" + e.name + "): " + e.message + " @" + (e.lineNumber || "") + ":" + (e.columnNumber || "") + " in: " + (e.fileName || "--") + " \n->", (extra ? extra : "")) //+"; by:"+(e.stack||e.description||"")
  },
  log(obj: any, mark?: string | Array<any>, type?: string) {
    //nx: log(mark='',type='log',...obj)
    if (!this.options.log || process.env.NODE_ENV != "development") return;
    mark = mark || "";
    type = type || mark == "error" ? "error" : "log";
    obj = util.inspect(obj, {
      maxArrayLength: null,
      depth: null,
      colors: true,
      //compact: false,
      breakLength: 100
    });
    if (typeof mark == "string")
      mark = (this.options.mark != "" ? this.options.mark + "/" : "") + mark;
    else if (mark instanceof Array)
      mark[0] =
        (this.options.mark != "" ? this.options.mark + "/" : "") + mark[0];

    console[type](`---\n ${mark}:\n`, obj, "\n---");
  },
  now(): number {
    //ms
    return Math.round(new Date().getTime());
  },
  isArray: function(obj: any): boolean {
    return (
      obj &&
      (obj instanceof Array ||
        (typeof obj != "string" && typeof obj[Symbol.iterator] == "function"))
    );
  },
  inArray: function(
    el: any,
    arr: Array<any> | object | string,
    sensitive?: boolean //case sensitive
  ): boolean {
    return this.run({ run: "eldeeb/inArray", el, arr, sensitive }, () => {
      if (!sensitive && typeof el == "string") el = el.toLowerCase();
      if (this.isArray(arr)) {
        for (var i = 0; i < (<Array<any>>arr).length; i++) {
          if (!sensitive && typeof arr[i] == "string")
            arr[i] = arr[i].toLowerCase();
          if (arr[i] == el) return true;
        }
      } else if (typeof arr == "object") return el in arr;
      else if (typeof arr == "string") return arr.indexOf(el);
    });
  },
  sleep: function(seconds?: number) {
    //to pause a js function make it async and use await sleep(duration);
    //ex: this.run(async fn(){await this.sleep(1); alert(1);})
    if (!seconds) seconds = 2;
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  },
  //assigns a default value to a variable; if(!x)use y
  df: function(x: any, y: any) {
    return typeof x == "undefined" ? y : x;
  },
  objectType: function(obj: any): string {
    return Object.prototype.toString
      .call(obj)
      .replace("[object ", "")
      .replace("]", "")
      .toLowerCase();
    /*
    examples:
   {} => object
   [] => array
   null => null
   function(){} => function
   1 => number
   "x", 'x', `x` => string
   */
  },

  isEmpty(obj: any): boolean {
    return typeof obj == "undefined" || this.inArray(obj, ["", null, [], {}]);
  },
  /*
   log:function(...msg){
    if(msg[0]=="e" || msg[0]=="error"){msg.shift();cns=console.error;}
    else if(msg[0]=="w" || msg[0]=="warn" || msg[0]=="warning"){msg.shift();cns=console.warn;}
    else{
      if(msg[0]=="log")msg.shift();
      cns=console.log;
    }
    cns(...msg);
  },*/

  merge(target: any, ...obj: any[]): any {
    //merge objects,arrays,classes (must besame type) ;
    //don't use "arguments" in an arrow functions
    return this.run(["merge", target, ...obj], function() {
      let type = this.objectType(target);
      for (var i = 1; i < arguments.length; i++) {
        if (this.objectType(arguments[i]) !== type) return target;
      }
      if (type == "array") {
        target = target.concat(...obj);
      } else if (type == "object") {
        //target=Object.assign(target,...obj) //later objects dosen't override previous ones
        for (var i = 1; i < arguments.length; i++) {
          for (var p in arguments[i]) {
            target[p] = arguments[i][p]; //to override current values
          }
        }
      } else if (type == "class") {
        //add or override target's methods & properties
      }

      return target;
    });
  },
  json(data: string | object) {
    if (typeof data == "string") {
      if (data.trim().charAt(0) == "{") return JSON.parse(data);
      if (
        data
          .split(".")
          .pop()
          .toLowerCase() == "json"
      )
        return require(data); //load a .json file
      data = require("fs").readFileSync(data);
      return JSON.parse(<string>data);
    } else return JSON.stringify(data);
    //nx: if(string & !start)
  },

  // =======================================================================================//
  //Loading modules

  db(
    type: string,
    options: object,
    done?: () => any,
    fail?: () => any,
    events?: any
  ) {
    if (typeof type == "undefined" || type == "mongo" || type == "mongoose")
      type = "mongoDB";
    /*
    todo: swipe arguments; create overload functions
    else if (this.objectType(type) == "object") {
      fail = done;
      done = options;
      options = type;
      type = "mongoDB";
    }*/
    let db = require(`./db-${type}.js`).default;
    return new db(options, done, fail, events); //nx: if file_exists
  },

  promise(
    fn: promiseTypes.FN,
    done?: promiseTypes.NEXT,
    failed?: promiseTypes.NEXT
  ) {
    //eldeeb = this
    let promise = require("./promise.js").default;
    return new promise(fn, done, failed);
  },
  when(fn: () => any, done?: () => any, failed?: () => any) {
    return this.promise(fn, done, failed);
  },
  error(error: errorTypes.Err, throwError?: boolean, jsError?: boolean) {
    let err = require("./error.js").default;
    return new err(error, throwError, jsError);
  },

  data(root: string) {
    let data = require("./data.js").default;
    return new data(root);
  }
};
