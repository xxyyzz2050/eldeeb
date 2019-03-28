import eldeeb from "./index.js";
import fs from "fs";
import Path from "path";
eldeeb.options.mark = "files";
export default class data {
  //TODO: move file operates from Data.js to here

  extenstion(file) {
    if (typeof file != "string") return null;
    //TODO: if(file[0]=='.' && no other ".")return file
    return Path.extname(file);

    //old: return files[i].split(".").pop()
  }
  size() {}
  isDir(path: string): boolean {
    return true;
  } //nx:
  move(oldPath, newPath, options) {
    let destination = this.isDir(oldPath) ? newPath : Path.dirname(newPath);
    fs.renameSync(oldPath, newPath);
    /*TODO:
      - if faild, try copy & unlink
      - options.existing:override|rename_pattern|continue
    */
  }
}
