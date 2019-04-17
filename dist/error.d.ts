export interface ErrObj {
    num?: number;
    type?: string;
    msg?: string;
    link?: string;
    details?: any;
}
export declare type Err = number | Array<any> | ErrObj | (() => Err);
export default function (err: Err, throwError?: boolean, jsError?: boolean): any;
