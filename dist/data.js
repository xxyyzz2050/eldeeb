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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./index.js"));
let eldeeb = new index_js_1.default({
    mark: "data"
});
module.exports = class {
    constructor(root) {
        eldeeb.run(Object.assign({ run: "{}" }, arguments), () => {
            this.root = path_1.default.resolve(root.toString() || "");
        });
    }
    mtime(file) {
        return eldeeb.run(Object.assign({ run: "" }, arguments), () => {
            return fs_1.default.statSync(file).mtimeMs;
        });
    }
    path(path) {
        return eldeeb.run(Object.assign({ run: "" }, arguments), () => {
            return path_1.default.normalize(path_1.default.join(this.root, path.toString()));
        });
    }
    cache(file, data, expire, type, allowEmpty) {
        return eldeeb.run(Object.assign({ run: "cache" }, arguments), () => __awaiter(this, void 0, void 0, function* () {
            let now = eldeeb.now();
            file = this.path(file);
            this.mkdir(path_1.default.dirname(file));
            expire *= 60 * 60 * 1000;
            if (!fs_1.default.existsSync(file) ||
                (!isNaN(expire) &&
                    (expire < 0 || this.mtime(file) + expire < now))) {
                eldeeb.log(`cache: ${file} updated`);
                if (typeof data == "function")
                    data = yield data();
                let dataType = eldeeb.objectType(data);
                if (dataType == "array" || dataType == "object")
                    fs_1.default.writeFileSync(file, JSON.stringify(data));
                else if (allowEmpty || !eldeeb.isEmpty(data))
                    fs_1.default.writeFileSync(file, data);
            }
            else {
                data = fs_1.default.readFileSync(file, "utf8");
                if (type == "json")
                    return JSON.parse(data);
            }
            return data;
        }));
    }
    mkdir(path, mode, index) {
        return eldeeb.run(Object.assign({ run: "mkdir" }, arguments), () => {
            if (path instanceof Array)
                return path.map(el => this.mkdir(el, mode, index));
            path = this.path(path);
            try {
                fs_1.default.existsSync(path) || fs_1.default.mkdirSync(path, { recursive: true });
                if (index !== false) {
                    if (!index)
                        index = '<meta http-equiv="REFRESH" content="0;url=/">';
                    fs_1.default.writeFileSync(path_1.default.join(path.toString(), "index.htm"), index);
                    return true;
                }
            }
            catch (e) {
                eldeeb.log(e, "mkdir/error", "error");
                return false;
            }
        });
    }
    delete(path, options) {
        return eldeeb.run(Object.assign({ run: "delete" }, arguments), () => {
            if (!path)
                return;
            path = this.path(path);
            if (fs_1.default.existsSync(path)) {
                fs_1.default.readdirSync(path).forEach(file => {
                    let curPath = `${path}/${file}`;
                    if (fs_1.default.lstatSync(curPath).isDirectory()) {
                        if (!options.files)
                            this.delete(curPath);
                    }
                    else
                        fs_1.default.unlinkSync(curPath);
                });
                if (!options.keepDir)
                    fs_1.default.rmdirSync(path);
            }
        });
    }
    inArray(array, el) {
        return eldeeb.run(Object.assign({ run: "inArray" }, arguments), () => array.includes(el));
    }
};
//# sourceMappingURL=data.js.map