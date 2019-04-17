interface deleteOptions {
    files?: boolean;
    keepDir?: boolean;
}
declare type PathLike = import("fs").PathLike;
export default class data {
    root: string;
    constructor(root: string);
    mtime(file: PathLike): any;
    path(path: PathLike): any;
    cache(file: PathLike, data?: any, expire?: number, json?: boolean, allowEmpty?: boolean): any;
    mkdir(path: PathLike | PathLike[], mode?: number | string, //ex: 0777
    index?: string | boolean): any;
    delete(path: PathLike, options?: deleteOptions): any;
    inArray(array: any[], el: any): any;
}
export {};
