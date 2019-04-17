"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let eldeeb = new index_js_1.default({
    mark: "files"
});
var moveOptionsExisting;
(function (moveOptionsExisting) {
    moveOptionsExisting[moveOptionsExisting["replace"] = 0] = "replace";
    moveOptionsExisting[moveOptionsExisting["rename"] = 1] = "rename";
    moveOptionsExisting[moveOptionsExisting["continue"] = 2] = "continue";
    moveOptionsExisting[moveOptionsExisting["stop"] = 3] = "stop";
})(moveOptionsExisting || (moveOptionsExisting = {}));
class data {
    //TODO: move file operates from Data.js to here
    //todo: create class fileSync
    /*
    provide file path to all methods, to avoid creating a new instance for every file
    i.e new file(path).size() -> new file().size(path)
    if path didn't provided, this.path will be used
    */
    constructor(path) {
        this.path = path;
    }
    ext(file) {
        return eldeeb.run(Object.assign({ run: "ext" }, arguments), () => {
            if (!file)
                file = this.path;
            if (typeof file != "string")
                return null;
            //TODO: if(file[0]=='.' && no other ".")return file
            return path_1.default.extname(file);
            //old: return files[i].split(".").pop()
        });
    }
    //file size in bytes
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
            return true; //todo
        });
    }
    move(path, newPath, options) {
        return eldeeb.run(Object.assign({ run: "move" }, arguments), () => {
            //let destination = this.isDir(path) ? newPath : Path.dirname(newPath); //todo: ??
            fs_1.default.renameSync(path, newPath);
            /*TODO:
             - if faild, try copy & unlink
             - options.existing:replace|rename_pattern|continue
           */
            return {}; //todo: report
        });
    }
}
exports.default = data;
//# sourceMappingURL=files.js.map