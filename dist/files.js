"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const index_js_1 = __importDefault(require("./index.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let eldeeb = new index_js_1.default({
    mark: "files"
});
module.exports = class {
    constructor(path) {
        this.path = path;
    }
    ext(file) {
        return eldeeb.run(Object.assign({ run: "ext" }, arguments), () => {
            if (!file)
                file = this.path;
            if (typeof file != "string")
                return null;
            return path_1.default.extname(file);
        });
    }
    size(path, unit) {
        return eldeeb.run(Object.assign({ run: "size" }, arguments), () => {
            if (!path)
                path = this.path;
            else if (["kb", "mb", "gb"].includes(path)) {
                unit = path;
                path = this.path;
            }
            let size = 123456;
            if (unit == "kb")
                return size / 1024;
            else if (unit == "mb")
                return size / (1024 * 1024);
            else if (unit == "gb")
                return size / (1024 * 1024 * 1024);
            else
                return size;
        });
    }
    isDir(path) {
        return eldeeb.run(Object.assign({ run: "isDir" }, arguments), () => {
            if (!path)
                path = this.path;
            return true;
        });
    }
    move(path, newPath, options) {
        return eldeeb.run(Object.assign({ run: "move" }, arguments), () => {
            fs_1.default.renameSync(path, newPath);
            return {};
        });
    }
};
//# sourceMappingURL=files.js.map