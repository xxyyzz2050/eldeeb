export default class extends Promise<any> {
    $stop?: boolean;
    clearTimeout: <T>(value?: T | PromiseLike<T>) => void;
    private _promise;
    constructor(fn: any, done?: promise.NEXT, failed?: promise.NEXT, $stop?: boolean);
    when(fn: any, done?: promise.NEXT, failed?: promise.NEXT, stop?: boolean): any;
    wait(seconds: number | (() => number), done?: promise.NEXT, fail?: promise.NEXT, stop?: boolean): any;
    then(done?: promise.NEXT, fail?: promise.NEXT, stop?: boolean): Promise<any>;
    done(done: promise.NEXT, stop?: boolean): Promise<any>;
    fail(fail: promise.NEXT, stop?: boolean): Promise<any>;
    stop(): this;
    complete(fn: promise.NEXT, done?: promise.NEXT, fail?: promise.NEXT): any;
    finally(fn: promise.NEXT, done?: promise.NEXT, fail?: promise.NEXT): any;
    limit(seconds: number, ...fn: Array<() => any>): any;
    all(promises: Array<any>, done?: promise.NEXT, fail?: promise.NEXT): Promise<any>;
    race(promises: any[], done?: promise.NEXT, fail?: promise.NEXT): any;
    resolve(value?: any, seconds?: number): any;
    reject(error?: any, seconds?: number): any;
}
