import fs from "fs";
import Path from "path";
import $eldeeb from "./index.js";

/*
Todo:
- create class dataSync
*/
let eldeeb = new $eldeeb({
  mark: "data"
});

export default class data {
  constructor(public root: string) {
    eldeeb.run({ run: "{}", ...arguments }, () => {
      this.root = Path.resolve(root || ""); //if it null it will be the current working dir (of the working script)
    });
  }

  mtime(file: data.PathLike) {
    //modified time of a file in MS
    return eldeeb.run({ run: "", ...arguments }, () => {
      return fs.statSync(file).mtimeMs;
    });
  }
  path(path: data.PathLike) {
    //add root & normalize the path to guarantee that the path seperator type of the operating system will be used consistently (e.g. this will turn C:\directory/test into C:\directory\test (when being on Windows)
    return eldeeb.run({ run: "", ...arguments }, () => {
      return Path.normalize(Path.join(this.root, path.toString())); //nx: resolve()?
    });
  }
  cache(
    file: data.PathLike,
    data?: any,
    expire?: number,
    json?: boolean,
    allowEmpty?: boolean
  ) {
    /*  returns a promise (because some operations executed in async mode) , use await or .then()
        allowEmpty: allow creating an empty cache file
        expire (hours)
    */
    return eldeeb.run({ run: "cache", ...arguments }, async () => {
      let now = eldeeb.now();
      this.mkdir(Path.dirname(file.toString()));
      file = this.path(file);
      expire *= 60 * 60 * 1000; //ms
      if (
        !fs.existsSync(file) ||
        (!isNaN(expire) && (expire < 0 || this.mtime(file) + expire < now))
      ) {
        eldeeb.log(`cache: ${file} updated`);
        if (typeof data == "function") data = await data(); //data() may be async or a Promise
        if (eldeeb.isArray(data) || eldeeb.objectType(data) == "object") {
          let string = JSON.stringify(data);
          fs.writeFileSync(file, string);
          if (data == "string") return string;
          else return data;
        } else {
          if (allowEmpty || !eldeeb.isEmpty(data)) fs.writeFileSync(file, data);
          if (json) return JSON.parse(data);
          else return data;
        }
      } else {
        data = fs.readFileSync(file, "utf8"); //without encoding (i.e utf-8) will return a stream insteadof a string
        if (json) return JSON.parse(data);
        else return data;
      }
    });
  }

  mkdir(
    path: data.PathLike | data.PathLike[],
    mode?: number | string, //ex: 0777
    index?: string | boolean //ex: index.html
  ) {
    return eldeeb.run({ run: "mkdir", ...arguments }, () => {
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
        path = <data.PathLike>path;
        fs.existsSync(path) || fs.mkdirSync(path, { recursive: true });
        if (index !== false) {
          if (!index) index = '<meta http-equiv="REFRESH" content="0;url=/">';
          fs.writeFileSync(Path.join(path.toString(), "index.htm"), index);
          return true;
        }
      } catch (e) {
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

  delete(path: data.PathLike, options?: data.deleteOptions) {
    return eldeeb.run({ run: "delete", ...arguments }, () => {
      if (!path) return;
      path = this.path(path);
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
          let curPath = `${path}/${file}`;
          if (fs.lstatSync(curPath).isDirectory()) {
            if (!options.files) this.delete(curPath);
          } else fs.unlinkSync(curPath);
        });
        if (!options.keepDir) fs.rmdirSync(path);
      }
    });
  }

  inArray(array: any[], el: any) {
    return eldeeb.run({ run: "inArray", ...arguments }, () =>
      array.includes(el)
    );
  }
}
