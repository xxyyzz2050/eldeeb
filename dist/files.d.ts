declare const _default: {
    new (path: string): {
        path: string;
        ext(file?: string): any;
        size(path?: string, unit?: string): number;
        isDir(path?: string): boolean;
        move(path: string, newPath: string, options?: files.moveOptions): {};
    };
};
export = _default;
