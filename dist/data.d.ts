/// <reference types="node" />
import fs from "fs";
declare const _default: {
    new (root: string): {
        root: string;
        mtime(file: fs.PathLike): any;
        path(path: fs.PathLike): any;
        cache(file: fs.PathLike, data?: any, expire?: number, json?: boolean, allowEmpty?: boolean): any;
        mkdir(path: string | Buffer | import("url").URL | fs.PathLike[], mode?: string | number, index?: string | boolean): any;
        delete(path: fs.PathLike, options?: data.deleteOptions): any;
        inArray(array: any[], el: any): any;
    };
};
export = _default;
