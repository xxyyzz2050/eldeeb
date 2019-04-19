/// <reference path="types.d.ts" />
declare const _default: {
    new (options?: index.TypeOptions): {
        options?: index.TypeOptions;
        run(mark?: any, fn?: () => any, isPromise?: boolean): any;
        err(e: any, at?: string | number, extra?: any): void;
        log(obj: any, mark?: string | any[], type?: string): void;
        now(): number;
        isArray(obj: any): boolean;
        inArray(el: any, arr: string | object | any[], sensitive?: boolean): boolean;
        sleep(seconds?: number): Promise<{}>;
        df(x: any, y: any): any;
        objectType(obj: any): string;
        isEmpty(obj: any): boolean;
        merge(target: any, ...obj: any[]): any;
        json(data: string | object): any;
        db(type: string, options: object, done?: () => any, fail?: () => any, events?: any): any;
        promise(fn: promise.FN, done?: (x?: any) => any, failed?: (x?: any) => any): any;
        when(fn: () => any, done?: () => any, failed?: () => any): any;
        error(error: error.Err, throwError?: boolean, jsError?: boolean): any;
        data(root: string): any;
    };
};
export = _default;
