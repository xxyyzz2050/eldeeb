declare namespace index {
    type TypeOptions = {
        log?: boolean;
        debug?: boolean;
        minLogLevel?: string;
        mark?: string;
    };
    interface obj {
        [key: string]: any;
    }
}
declare namespace files {
    enum moveOptionsExisting {
        "replace" = 0,
        "rename" = 1,
        "continue" = 2,
        "stop" = 3
    }
    interface moveOptions {
        existing: moveOptionsExisting;
    }
}
declare namespace data {
    interface deleteOptions {
        files?: boolean;
        keepDir?: boolean;
    }
    type PathLike = import("fs").PathLike;
}
declare namespace promise {
    type FN = <T>(resolve?: RESOLVE<T>, reject?: (reason?: any) => void) => Promise<T> | void | Array<T>;
    type RESOLVE<T> = (value?: T | PromiseLike<T>) => void;
    type NEXT = ((x?: any) => any);
}
declare namespace error {
    interface ErrObj {
        num?: number;
        type?: string;
        msg?: string;
        link?: string;
        details?: any;
    }
    type Err = number | Array<any> | ErrObj | (() => Err);
}
declare namespace dbMongoDB {
    type timeStamp = boolean | number | (() => number) | {
        type: DateConstructor;
        default: number | (() => number);
    };
    interface schemaObj {
        fields?: object;
        agjust?: object;
        times?: timeStamp | [timeStamp, timeStamp];
        createdAt?: timeStamp;
        modifiedAt?: timeStamp;
        [key: string]: any;
    }
    interface connectionOptions extends index.obj {
    }
    interface modelOptions extends index.obj {
    }
}
