export default class promise extends Promise<any> {
    $stop?: boolean;
    clearTimeout: <T>(value?: T | PromiseLike<T>) => void;
    constructor(fn: promise.FN, done?: promise.NEXT, failed?: promise.NEXT, $stop?: boolean);
    when(fn: promise.FN, done?: promise.NEXT, failed?: promise.NEXT, stop?: boolean): promise;
    wait(seconds: number | (() => number), done?: promise.NEXT, fail?: promise.NEXT, stop?: boolean): any;
    then(done?: promise.NEXT, fail?: promise.NEXT, stop?: boolean): any;
    done(done: promise.NEXT, stop?: boolean): any;
    fail(fail: promise.NEXT, stop?: boolean): any;
    stop(): this;
    complete(fn: promise.NEXT, done?: promise.NEXT, fail?: promise.NEXT): any;
    finally(fn: promise.NEXT, done?: promise.NEXT, fail?: promise.NEXT): any;
    limit(seconds: number, ...fn: Array<() => any>): any;
    all(promises: Array<any>, done?: promise.NEXT, fail?: promise.NEXT): any;
    race(promises: any[], done?: promise.NEXT, fail?: promise.NEXT): any;
    resolve(value?: any, seconds?: number): any;
    reject(error?: any, seconds?: number): any;
}
