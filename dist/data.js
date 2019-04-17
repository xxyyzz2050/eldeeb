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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./index.js"));
/*
Todo:
- create class dataSync
*/
let eldeeb = new index_js_1.default({
    mark: "data"
});
class data {
    constructor(root) {
        this.root = root;
        eldeeb.run(Object.assign({ run: "{}" }, arguments), () => {
            this.root = path_1.default.resolve(root || ""); //if it null it will be the current working dir (of the working script)
        });
    }
    mtime(file) {
        //modified time of a file in MS
        return eldeeb.run(Object.assign({ run: "" }, arguments), () => {
            return fs_1.default.statSync(file).mtimeMs;
        });
    }
    path(path) {
        //add root & normalize the path to guarantee that the path seperator type of the operating system will be used consistently (e.g. this will turn C:\directory/test into C:\directory\test (when being on Windows)
        return eldeeb.run(Object.assign({ run: "" }, arguments), () => {
            return path_1.default.normalize(path_1.default.join(this.root, path.toString())); //nx: resolve()?
        });
    }
    cache(file, data, expire, json, allowEmpty) {
        /*  returns a promise (because some operations executed in async mode) , use await or .then()
            allowEmpty: allow creating an empty cache file
            expire (hours)
        */
        return eldeeb.run(Object.assign({ run: "cache" }, arguments), () => __awaiter(this, void 0, void 0, function* () {
            let now = eldeeb.now();
            this.mkdir(path_1.default.dirname(file.toString()));
            file = this.path(file);
            expire *= 60 * 60 * 1000; //ms
            if (!fs_1.default.existsSync(file) ||
                (!isNaN(expire) && (expire < 0 || this.mtime(file) + expire < now))) {
                eldeeb.log(`cache: ${file} updated`);
                if (typeof data == "function")
                    data = yield data(); //data() may be async or a Promise
                if (eldeeb.isArray(data) || eldeeb.objectType(data) == "object") {
                    let string = JSON.stringify(data);
                    fs_1.default.writeFileSync(file, string);
                    if (data == "string")
                        return string;
                    else
                        return data;
                }
                else {
                    if (allowEmpty || !eldeeb.isEmpty(data))
                        fs_1.default.writeFileSync(file, data);
                    if (json)
                        return JSON.parse(data);
                    else
                        return data;
                }
            }
            else {
                data = fs_1.default.readFileSync(file, "utf8"); //without encoding (i.e utf-8) will return a stream insteadof a string
                if (json)
                    return JSON.parse(data);
                else
                    return data;
            }
        }));
    }
    mkdir(path, mode, //ex: 0777
    index //ex: index.html
    ) {
        return eldeeb.run(Object.assign({ run: "mkdir" }, arguments), () => {
            if (path instanceof Array)
                return path.map(el => this.mkdir(el, mode, index));
            path = this.path(path);
            //eldeeb.log(path, 'path')
            // mode=mode||"0777"
            /*
            //recursive https://stackoverflow.com/a/24311711
            let parts = path.split(Path.sep)
            //eldeeb.log(parts, 'mkdir/parts')
            let n = parts[0].indexOf(':') ? 2 : 1 //on windows the absoulute path starts with a drive letter (ex: C:), path.join('C:')=>'C:.' witch gives an error when we try to create it and we don't need to create a drive
            for (let i = n; i <= parts.length; i++) {
              let partPath = Path.join.apply(null, parts.slice(0, i))
              //eldeeb.log({ partPath: partPath, slice: parts.slice(0, i) },'mkdir/partPath')
              try {
                fs.existsSync(partPath) || fs.mkdirSync(partPath, {mode:mode}) //needs review -> use try&catch ?
                if (index !== false) {
                  if (!index) index = '<meta http-equiv="REFRESH" content="0;url=/">'
                  fs.writeFileSync(Path.join(partPath, 'index.htm'), index)
                  //don't return true here, because it will exit the loop
                }
              } catch (e) {
                eldeeb.log(e, 'mkdir/error', 'error')
                return false
              }
            }*/
            try {
                path = path;
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
    //delete files or folders recursively  https://stackoverflow.com/a/32197381
    //nx: check path type (file/folder)
    /*
     options:
     outer: if false, only remove folder contains but don't remove the folder itself (affects folders only)
     files: if true, only remove files (nx: dirs:false|empty false:don't remove dirs, empty=only remove empty dirs)
  
    options?: { [name: string]: any } https://stackoverflow.com/questions/42027864/is-there-any-way-to-target-the-plain-javascript-object-type-in-typescript
    */
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
}
exports.default = data;
//# sourceMappingURL=data.js.map