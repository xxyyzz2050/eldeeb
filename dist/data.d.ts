/// <reference types="./index" />
export default class data {
    root: string;
    constructor(root: string);
    mtime(file: data.PathLike): any;
    path(path: data.PathLike): any;
    cache(file: data.PathLike, data?: any, expire?: number, json?: boolean, allowEmpty?: boolean): any;
    mkdir(path: data.PathLike | data.PathLike[], mode?: number | string, index?: string | boolean): any;
    delete(path: data.PathLike, options?: data.deleteOptions): any;
    inArray(array: any[], el: any): any;
}
