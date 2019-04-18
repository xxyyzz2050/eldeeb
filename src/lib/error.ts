/// <reference types="./index" />
import $eldeeb from "./index.js";

let eldeeb = new $eldeeb({
  mark: "error"
});

/*
- nx: add: file,line,colNumber,stack,...
- wrong: throw new Error() from this file, will include file & lineNumber of this file (not the file witch throw the error), so we have to get the correct file,lineNumber

*/

export default function(
  err: error.Err,
  throwError?: boolean,
  jsError?: boolean
) {
  //or: class error extends Error -> to add trace to error info (returns only Error object, not object)
  let errors = {
    0: {
      type: "eldeeb/$className/fn",
      msg: "$details"
    },
    100: {
      type: "eldeeb/db-mongoDB/()",
      msg: "connection uri"
    }
  };

  //to get the default format errors[0]
  if (typeof err == "function") err = err();
  if (err instanceof Array)
    err = {
      num: err[0],
      type: err[1],
      msg: err[2],
      link: err[3],
      details: err[4]
    };
  else if (typeof err == "number")
    err = <error.Err>{ num: err, type: "eldeeb" };

  if (<error.ErrObj>err) {
    //eldeeb.objectType(err) == "object"
    //if(eldeeb.isEmpty(tmp.type)||tmp.type=="eldeeb"){tmp[1]="eldeeb"; err=errors[tmp.num]}
    if ((<error.ErrObj>err).type == "eldeeb") {
      //standard eldeeb error
      this.err = errors[(<error.ErrObj>err).num];
    } else this.err = { type: (<error.ErrObj>err).type };
    this.err.num = (<error.ErrObj>err).num;
    //override default err object
    if (!eldeeb.isEmpty((<error.ErrObj>err).msg))
      this.err.msg = (<error.ErrObj>err).msg;
    if (!eldeeb.isEmpty((<error.ErrObj>err).details))
      this.err.details = (<error.ErrObj>err).details;
    this.err.link = (!eldeeb.isEmpty((<error.ErrObj>err).link)
      ? (<error.ErrObj>err).link
      : "https://eldeeb.com/error/{num}-{msg}"
    )
      .replace(/{(.*?)}/gi, x => this.err[x])
      .replace(" ", "-"); //or: ${..}; this.err[$1] is invalid

    if (throwError) {
      if (jsError) throw new Error(this.err); //or Error(this.err.msg) because it accepts 'string' (not object)
      throw this.err;
    }
  } else {
    if (throwError) throw new Error(this.err);
    else this.err = { msg: err };
  }
  return this.err;
}
