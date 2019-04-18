//contains all definitions
declare namespace files {
  enum moveOptionsExisting {
    "replace",
    "rename", //todo: rename pattern ex: {{filename}}({{count++}}).{{ext}}
    "continue", //ignore
    "stop"
  }
  interface moveOptions {
    existing: moveOptionsExisting;
  }
}

declare namespace data {
  interface deleteOptions {
    files?: boolean; //delete files only, dont delete folders
    keepDir?: boolean; //if false, delete the folder content, but not the folder itself, default=false
    //[name: string]: any;
  }
  type PathLike = import("fs").PathLike; //or use ///<referce ...>
}

declare namespace promise {
  type FN = <T>(
    resolve?: RESOLVE<T>,
    reject?: (reason?: any) => void
  ) => Promise<T> | void | Array<T>;
  type RESOLVE<T> = (value?: T | PromiseLike<T>) => void;
  type NEXT = ((x?: any) => any);
}

declare namespace error {
  interface ErrObj {
    num?: number;
    type?: string;
    msg?: string;
    link?: string;
    details?: any;
  }
  type Err = number | Array<any> | ErrObj | (() => Err);
}

declare namespace dbMongoDB {
  //timestamp : true = Date.now | $timestamp | (()=>number) = Date.now | {type:Date, default: timeStamp}
  type timeStamp =
    | boolean
    | number
    | (() => number)
    | { type: DateConstructor; default: number | (() => number) };

  interface schemaObj {
    fields?: object;
    agjust?: object;
    times?: timeStamp | [timeStamp, timeStamp]; //or timestamp[] or Array<timeStamp>
    createdAt?: timeStamp;
    modifiedAt?: timeStamp; //todo: modifiedAt?:this.createdAt
    [key: string]: any;
  }

  interface options {
    [key: string]: any;
  }
}
