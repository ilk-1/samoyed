import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";


(function main() {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const __shell_path = process.cwd();

    const pkg_name = ".samoyed";
    fs.removeSync(path.join(__shell_path, pkg_name));
    fs.mkdirSync(path.join(__shell_path, pkg_name));
    fs.mkdirSync(path.join(__shell_path, pkg_name, "githooks"));

    fs.copyFile(
      path.join(__dirname, ".samoyedrc.json"),
      path.join(__shell_path, ".samoyedrc.json")
    )
    fs.copyFile(
      path.join(__dirname, "main.mjs"), 
      path.join(__shell_path, pkg_name, "main.mjs")
    );
    fs.copyFile(
      path.join(__dirname, "githooks/pre-commit"), 
      path.join(__shell_path, pkg_name, "githooks/pre-commit")
    );
    fs.copyFile(
      path.join(__dirname, "githooks/commit-msg"), 
      path.join(__shell_path, pkg_name, "githooks/commit-msg")
    );

    exec(`git config core.hooksPath ${path.join(__shell_path, pkg_name, "githooks")}`, 
      { windowsHide: true }, 
      (error, stdout, stderr) => {
        console.log("If you meet `The '.samoyed/commit-msg' hook was ignored because it's not set as executable.`, please run `chmod 777 .samoyed/*` first.")
        if (error) {
          console.log(error);
          process.exit(1);
        }
        if (stdout) {
          console.log(stdout);
          process.exit(0);
        }
        if (stderr) {
          console.log(stderr);
          process.exit(1);
        }
    });
})();
