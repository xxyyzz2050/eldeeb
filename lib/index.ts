import util from "util";
//console.log('util:', util) //using require&module.exports will prevent this line from calling when run via localhost (called when run via cmd) ,the problem is in : eldeeb/index/isArray->Symbol.iterator, adding quotes will fix it obj['Symbol.iterator'] but it will return a wrong value; may be the error is by Nuxt or babel
export default {
  options: {
    //options
    log: false, //nx: min log level
    minLogLevel: "log", //log,warn,error (verbose)
    debug: false,
    mark: "" //mark prefix
  },
  mode(mode: string) {
    if (mode == "dev") mode = "development";
    return mode ? process.env.NODE_ENV == mode : process.env.NODE_ENV;
  },
  run: function(mark?, promise?, fn?) {
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
    if (typeof promise == "function") {
      fn = promise;
      promise = false;
    } else if (typeof mark == "function") {
      fn = mark;
      mark = "";
      //  promise=false
    }

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

    if (!promise) {
      try {
        let f = fn();
        if (mark && this.options.log) console.log("success: eldeeb:", mark, f);
        return f;
      } catch (e) {
        this.err(e, mark, fn);
      }
    } else {
      promise = new Promise(fn); //fn must resolve the promise, fn(resolve,reject){if(finished)resolve(value)}
      if (mark && this.options.log)
        console.log("promise: eldeeb:", mark, promise /*, fn*/);
      return promise;
    }
    //note that any console.log() inside fn() will appear BEFORE console.log("Success:**"), success must be at the end of try{}
    //don't concatenate mark (or other objects) to expand them to show their properties (concatenation will cast it to string)
  },
  err: function(e, at, extra) {
    //  if (typeof at == "undefined") at = "eldeeb.js";
    console.error(
      `Error @eldeeb: ${at} ${e.name}${
        e.message ? ": " + e.message : e.description ? ": " + e.description : ""
      }\n${
        e.lineNumber ? " @" + e.lineNumber + " in" + e.fileName + "\n" : ""
      }${e.stack ? e.stack : ""}\n->` /*, (extra ? extra : "")*/
    );
    //console.error("Error @eldeeb: " + at + "(" + e.name + "): " + e.message + " @" + (e.lineNumber || "") + ":" + (e.columnNumber || "") + " in: " + (e.fileName || "--") + " \n->", (extra ? extra : "")) //+"; by:"+(e.stack||e.description||"")
  },
  log(obj, mark?, type?) {
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
  now() {
    //ms
    return Math.round(new Date().getTime());
  },
  isArray: function(obj) {
    return (
      obj &&
      (obj instanceof Array ||
        (typeof obj != "string" && typeof obj[Symbol.iterator] == "function"))
    );
  },
  inArray: function(str, arr, keepCase) {
    return this.run(["eldeeb/inArray", str, arr, keepCase], () => {
      if (!keepCase && typeof str == "string") str = str.toLowerCase();
      if (this.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
          if (!keepCase && typeof arr[i] == "string")
            arr[i] = arr[i].toLowerCase();
          if (arr[i] == str) return true;
        }
      } else if (typeof arr == "object") return str in arr;
    });
  },
  sleep: function(seconds) {
    //to pause a js function make it async and use await sleep(duration);
    //ex: this.run(async fn(){await this.sleep(1); alert(1);})
    if (!seconds) seconds = 2;
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  },
  df: function(k, v) {
    if (typeof k == "undefined") return v;
    else return k;
  },
  objectType: function(obj) {
    return Object.prototype.toString
      .call(obj)
      .replace("[object ", "")
      .replace("]", "")
      .toLowerCase();
    /*
   {} => object
   [] => array
   null => null
   function(){} => function
   1 => number
   "x", 'x', `x` => string
   */
  },
  in_array: function(x, a, str) {
    if (typeof a != "object") return;
    for (let i = 0; i < a.length; i++) {
      if (a[i] == x || (str && x.indexOf(a[i]) != -1)) return true;
    }
  },
  isEmpty(obj) {
    return typeof obj == "undefined" || this.in_array(obj, ["", null, [], {}]);
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

  merge(target, ...obj) {
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
  json(data) {
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
      return JSON.parse(data);
    } else return JSON.stringify(data);
    //nx: if(string & !start)
  },

  //Loading modules
  db(type, options, done, fail, events) {
    if (typeof type == "undefined" || type == "mongo" || type == "mongoose")
      type = "mongoDB";
    else if (this.objectType(type) == "object") {
      fail = done;
      done = options;
      options = type;
      type = "mongoDB";
    }
    let db = require(`./db-${type}.js`).default;
    return new db(options, done, fail, events); //nx: if file_exists
  },

  promise(fn, done?, failed?) {
    //eldeeb = this
    let promise = require("./promise.js").default;
    return new promise(fn, done, failed);
  },
  when(fn, done, failed) {
    return this.promise(fn, done, failed);
  },
  error(err, throwError?: boolean, jsError?: boolean) {
    let promise = require("./error.js").default;
    return new promise(err, throwError, jsError);
  },

  data(root) {
    let data = require("./data.js").default;
    return new data(root);
  }
};
