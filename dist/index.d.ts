/// <reference path="types.d.ts" />
export default class {
    options?: index.TypeOptions;
    constructor(options?: index.TypeOptions);
    run(mark?: any, fn?: () => any, isPromise?: boolean): any;
    err(e: any, at?: number | string, extra?: any): void;
    log(obj: any, mark?: string | Array<any>, type?: string): void;
    now(): number;
    isArray(obj: any): boolean;
    inArray(el: any, arr: Array<any> | object | string, sensitive?: boolean): boolean;
    sleep(seconds?: number): Promise<{}>;
    df(x: any, y: any): typeof x | typeof y;
    objectType(obj: any): string;
    isEmpty(obj: any): boolean;
    merge(target: any, ...obj: any[]): any;
    json(data: string | object): any;
    db(type: string, options: object, done?: () => any, fail?: () => any, events?: any): any;
    promise(fn: promise.FN, done?: promise.NEXT, failed?: promise.NEXT): any;
    when(fn: () => any, done?: () => any, failed?: () => any): any;
    error(error: error.Err, throwError?: boolean, jsError?: boolean): any;
    data(root: string): any;
}
