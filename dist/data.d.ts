import fs from "fs";
declare const _default: {
    new (root?: fs.PathLike): {
        root: string;
        mtime(file: fs.PathLike): number | bigint;
        path(path: fs.PathLike): string;
        cache(file: fs.PathLike, data?: any, expire?: number, type?: string, allowEmpty?: boolean): any;
        mkdir(path: string | Buffer | import("url").URL | fs.PathLike[], mode?: string | number, index?: string | boolean): boolean | boolean[];
        delete(path: fs.PathLike, options?: data.deleteOptions): void;
        inArray(array: any[], el: any): boolean;
    };
};
export = _default;
