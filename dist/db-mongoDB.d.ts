import * as mongoose from "mongoose";
declare const _default: {
    new (options?: dbMongoDB.connectionOptions, done?: (x?: any) => any, fail?: (x?: any) => any, events?: any): {
        promise: any;
        connection: any;
        models: any;
        ext: any;
        pk: any;
        uri: any;
        connect(options: dbMongoDB.connectionOptions, done: (x?: any) => any, fail: (x?: any) => any): any;
        encode(str: string): string;
        on(event: any, callback: any, once?: boolean): any;
        once(event: any, callback: any): any;
        schema(obj: dbMongoDB.schemaObj | mongoose.Schema<any>, options?: object, indexes?: (object | [object, object])[]): mongoose.Schema<any>;
        db_mongoDB_model(coll: string, schema?: string | dbMongoDB.schemaObj | mongoose.Schema<any>, options?: dbMongoDB.modelOptions, indexes?: (object | [object, object])[]): any;
        createIndex(model: any, index: any, options: any): any;
        index(model: any, index: any, options: any): any;
        set(key: any, value: any): void;
        select(): void;
        get(): void;
        shortId(): string;
        replace(entry: any, oldString: any, newString: any): {
            $trim: {
                input: {
                    $reduce: {
                        input: {
                            $split: any[];
                        };
                        initialValue: string;
                        in: {
                            $cond: (string | {
                                $eq: string[];
                                $concat?: undefined;
                            } | {
                                $concat: any[];
                                $eq?: undefined;
                            })[];
                        };
                    };
                };
                chars: any;
            };
        };
        implode(array: any, delimeter: any): any;
    };
};
export = _default;
