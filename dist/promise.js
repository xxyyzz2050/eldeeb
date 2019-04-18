"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
let eldeeb = new index_js_1.default({
    mark: "promise"
});
class promise extends Promise {
    constructor(fn, done, failed, $stop) {
        super(fn);
        this.$stop = $stop;
        return eldeeb.run(Object.assign({ run: "{}" }, arguments), () => {
            if (typeof fn != "function") {
                if (eldeeb.objectType(fn) == "array") {
                    let tmp = fn;
                    return Promise.all(tmp).then(done, failed);
                }
            }
            this.$stop = false;
            if (done || failed)
                return this.then(done, failed, $stop);
            return this;
        });
    }
    when(fn, done, failed, stop) {
        return new promise(fn, done, failed, stop);
    }
    wait(seconds, done, fail, stop) {
        return eldeeb.run(Object.assign({ run: "wait" }, arguments), () => {
            if (typeof seconds == "function")
                seconds = seconds();
            else if (typeof seconds != "number")
                seconds = 0;
            return eldeeb.run(["wait", seconds], () => {
                return this.then(() => this.when(resolve => {
                    this.clearTimeout = resolve;
                    let timeout = setTimeout(function () {
                        timeout.seconds = seconds;
                        resolve(timeout);
                    }, seconds * 1000);
                }, done, fail, stop));
            });
        });
    }
    then(done, fail, stop) {
        return eldeeb.run(Object.assign({ run: "then" }, arguments), () => __awaiter(this, void 0, void 0, function* () {
            if (!this.$stop) {
                if (stop)
                    this.stop();
                let tmp;
                if (done !== null &&
                    typeof done != "undefined" &&
                    typeof done != "function") {
                    tmp = done;
                    done = () => tmp;
                }
                if (fail !== null &&
                    typeof fail != "undefined" &&
                    typeof fail != "function") {
                    tmp = fail;
                    fail = () => tmp;
                }
                return super.then(done, fail);
            }
            return this;
        }));
    }
    done(done, stop) {
        return this.then(done, null, typeof stop == "undefined" ? true : false);
    }
    fail(fail, stop) {
        return this.then(null, fail, typeof stop == "undefined" ? true : false);
    }
    stop() {
        this.$stop = true;
        return this;
    }
    complete(fn, done, fail) {
        this.stop();
        return this.finally(fn, done, fail);
    }
    finally(fn, done, fail) {
        return this.finally(fn).then(done, fail);
    }
    limit(seconds, ...fn) {
        return eldeeb.run(Object.assign({ run: "limit" }, arguments), () => {
            return Promise.race([
                new Promise(reject => setTimeout(() => reject(new Error("request timeout")), seconds * 1000)),
                ...fn
            ]);
        });
    }
    all(promises, done, fail) {
        return this.then(() => Promise.all(promises)).then(done, fail);
    }
    race(promises, done, fail) {
        return eldeeb.run(Object.assign({ run: "race" }, arguments), () => {
            if (!eldeeb.isArray(promises))
                return this;
            return this.then(() => Promise.race(promises)).then(done, fail);
        });
    }
    resolve(value, seconds) {
        return eldeeb.run(Object.assign({ run: arguments.callee.name }, arguments), () => {
            if (seconds)
                return this.wait(seconds).resolve(value);
            Promise.resolve(value);
            return this;
        });
    }
    reject(error, seconds) {
        if (seconds)
            return this.wait(seconds).reject(error);
        Promise.reject(error);
        return this;
    }
}
exports.default = promise;
//# sourceMappingURL=promise.js.map