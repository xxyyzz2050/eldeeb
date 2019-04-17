"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_js_1 = __importDefault(require("../data.js"));
class data extends data_js_1.default {
    constructor(root) {
        root = root || ''; //nx: the root path of the project
        super(root); //nx: test if root is the path of this file or the parent file (i.e lib/data.js)
    }
    cache(file, data, expire, type, allowEmpty) {
        return super.cache('tmp/' + file, data, expire, type, allowEmpty);
    }
}
exports.default = data;
//# sourceMappingURL=data.js.map