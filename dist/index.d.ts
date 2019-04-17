export declare type FN = import("./promise").FN;
export declare type NEXT = import("./promise").NEXT;
export declare type ERROR = import("./error").Err;
export declare type TypeOptions = {
    log?: boolean;
    debug?: boolean;
    minLogLevel?: string;
    mark?: string;
};
export default class {
    options: TypeOptions;
    constructor(options: TypeOptions);
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
    promise(fn: FN, done?: NEXT, failed?: NEXT): any;
    when(fn: () => any, done?: () => any, failed?: () => any): any;
    error(error: ERROR, throwError?: boolean, jsError?: boolean): any;
    data(root: string): any;
}
