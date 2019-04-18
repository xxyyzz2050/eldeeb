//contains all types for all classes, organised in namespaces, each namespace contain types declarations for each corresponding class file

namespace index {
  export type TypeOptions = {
    log?: boolean; //log some events to the console
    debug?: boolean; //add 'debugger' mark
    minLogLevel?: string;
    mark?: string; //the child class of this class ex: promise,files,...
  };
}

namespace files {
  export enum moveOptionsExisting {
    "replace",
    "rename", //todo: rename pattern ex: {{filename}}({{count++}}).{{ext}}
    "continue", //ignore
    "stop"
  }
  export interface moveOptions {
    existing: moveOptionsExisting;
  }
}

namespace data {
  export interface deleteOptions {
    files?: boolean; //delete files only, dont delete folders
    keepDir?: boolean; //if false, delete the folder content, but not the folder itself, default=false
    //[name: string]: any;
  }
  export type PathLike = import("fs").PathLike; //or use ///<referce ...>
}

namespace promise {
  export type FN = <T>(
    resolve?: RESOLVE<T>,
    reject?: (reason?: any) => void
  ) => Promise<T> | void | Array<T>;
  export type RESOLVE<T> = (value?: T | PromiseLike<T>) => void;
  export type NEXT = ((x?: any) => any);
}

namespace error {
  export interface ErrObj {
    num?: number;
    type?: string;
    msg?: string;
    link?: string;
    details?: any;
  }
  export type Err = number | Array<any> | ErrObj | (() => Err);
}

namespace dbMongoDB {
  //timestamp : true = Date.now | $timestamp | (()=>number) = Date.now | {type:Date, default: timeStamp}
  export type timeStamp =
    | boolean
    | number
    | (() => number)
    | { type: DateConstructor; default: number | (() => number) };

  export interface schemaObj {
    fields?: object;
    agjust?: object;
    times?: timeStamp | [timeStamp, timeStamp]; //or timestamp[] or Array<timeStamp>
    createdAt?: timeStamp;
    modifiedAt?: timeStamp; //todo: modifiedAt?:this.createdAt
    [key: string]: any;
  }

  export interface options {
    [key: string]: any;
  }
}
