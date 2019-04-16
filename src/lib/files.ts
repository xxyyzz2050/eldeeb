import $eldeeb from "./index.js";
import fs from "fs";
import Path from "path";

let eldeeb = new $eldeeb({
  mark: "files"
});

enum moveOptionsExisting {
  "replace",
  "rename", //todo: rename pattern ex: {{filename}}({{count++}}).{{ext}}
  "continue", //ignore
  "stop"
}
interface moveOptions {
  existing: moveOptionsExisting;
}

export default class data {
  //TODO: move file operates from Data.js to here
  //todo: create class fileSync
  /*
  provide file path to all methods, to avoid creating a new instance for every file
  i.e new file(path).size() -> new file().size(path)
  if path didn't provided, this.path will be used
  */

  constructor(public path: string) {}

  ext(file?: string) {
    return eldeeb.run({ run: "ext", ...arguments }, () => {
      if (!file) file = this.path;
      if (typeof file != "string") return null;
      //TODO: if(file[0]=='.' && no other ".")return file
      return Path.extname(file);

      //old: return files[i].split(".").pop()
    });
  }

  //file size in bytes
  size(path?: string, unit?: string): number {
    return eldeeb.run({ run: "size", ...arguments }, () => {
      if (!path) path = this.path;
      else if (["kb", "mb", "gb"].includes(path)) {
        unit = path;
        path = this.path;
      }
      let size = 123456;
      if (unit == "kb") return size / 1024;
      else if (unit == "mb") return size / (1024 * 1024);
      else if (unit == "gb") return size / (1024 * 1024 * 1024);
      else return size;
    });
  }
  isDir(path?: string): boolean {
    return eldeeb.run({ run: "isDir", ...arguments }, () => {
      if (!path) path = this.path;
      return true; //todo
    });
  }

  move(path: string, newPath: string, options?: moveOptions): {} {
    return eldeeb.run({ run: "move", ...arguments }, () => {
      //let destination = this.isDir(path) ? newPath : Path.dirname(newPath); //todo: ??
      fs.renameSync(path, newPath);
      /*TODO:
       - if faild, try copy & unlink
       - options.existing:replace|rename_pattern|continue
     */
      return {}; //todo: report
    });
  }
}
