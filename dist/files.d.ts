declare enum moveOptionsExisting {
    "replace" = 0,
    "rename" = 1,
    "continue" = 2,
    "stop" = 3
}
interface moveOptions {
    existing: moveOptionsExisting;
}
export default class data {
    path: string;
    constructor(path: string);
    ext(file?: string): any;
    size(path?: string, unit?: string): number;
    isDir(path?: string): boolean;
    move(path: string, newPath: string, options?: moveOptions): {};
}
export {};
