"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
let eldeeb = new index_js_1.default({
    mark: "error"
});
function default_1(err, throwError, jsError) {
    let errors = {
        0: {
            type: "eldeeb/$className/fn",
            msg: "$details"
        },
        100: {
            type: "eldeeb/db-mongoDB/()",
            msg: "connection uri"
        }
    };
    if (typeof err == "function")
        err = err();
    if (err instanceof Array)
        err = {
            num: err[0],
            type: err[1],
            msg: err[2],
            link: err[3],
            details: err[4]
        };
    else if (typeof err == "number")
        err = { num: err, type: "eldeeb" };
    if (err) {
        if (err.type == "eldeeb") {
            this.err = errors[err.num];
        }
        else
            this.err = { type: err.type };
        this.err.num = err.num;
        if (!eldeeb.isEmpty(err.msg))
            this.err.msg = err.msg;
        if (!eldeeb.isEmpty(err.details))
            this.err.details = err.details;
        this.err.link = (!eldeeb.isEmpty(err.link)
            ? err.link
            : "https://eldeeb.com/error/{num}-{msg}")
            .replace(/{(.*?)}/gi, x => this.err[x])
            .replace(" ", "-");
        if (throwError) {
            if (jsError)
                throw new Error(this.err);
            throw this.err;
        }
    }
    else {
        if (throwError)
            throw new Error(this.err);
        else
            this.err = { msg: err };
    }
    return this.err;
}
exports.default = default_1;
//# sourceMappingURL=error.js.map