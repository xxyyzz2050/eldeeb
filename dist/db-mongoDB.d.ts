import * as mongoose from "mongoose";
export default class {
    private promise;
    connection: any;
    models: any;
    ext: any;
    pk: any;
    uri: any;
    constructor();
    connect(options?: dbMongoDB.connectionOptions, done?: promise.NEXT, fail?: promise.NEXT, events?: any): any;
    encode(str: string): string;
    on(event: any, callback: any, once?: boolean): any;
    once(event: any, callback: any): any;
    schema(obj: dbMongoDB.schemaObj | mongoose.Schema, options?: object, indexes?: Array<object | [object, object]>): mongoose.Schema;
    db_mongoDB_model(coll: string, schema?: string | mongoose.Schema | dbMongoDB.schemaObj, options?: dbMongoDB.modelOptions, indexes?: Array<object | [object, object]>): any;
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
}
