import fs from 'fs-extra'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url';

(function main () {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const shellPath = process.cwd()

  const pkgName = '.samoyed'
  fs.removeSync(path.join(shellPath, pkgName))
  fs.mkdirSync(path.join(shellPath, pkgName))
  fs.mkdirSync(path.join(shellPath, pkgName, 'githooks'))

  fs.copyFile(
    path.join(__dirname, '.samoyedrc.json'),
    path.join(shellPath, '.samoyedrc.json')
  )
  fs.copyFile(
    path.join(__dirname, 'main.mjs'),
    path.join(shellPath, pkgName, 'main.mjs')
  )
  fs.copyFile(
    path.join(__dirname, 'githooks/pre-commit'),
    path.join(shellPath, pkgName, 'githooks/pre-commit')
  )
  fs.copyFile(
    path.join(__dirname, 'githooks/commit-msg'),
    path.join(shellPath, pkgName, 'githooks/commit-msg')
  )

  exec(`git config core.hooksPath ${path.join(shellPath, pkgName, 'githooks')}`,
    { windowsHide: true },
    (error, stdout, stderr) => {
      console.log("If you meet `The '.samoyed/commit-msg' hook was ignored because it's not set as executable.`, please run `chmod 777 .samoyed/*` first.")
      if (error) {
        console.log(error)
        process.exit(1)
      }
      if (stdout) {
        console.log(stdout)
        process.exit(0)
      }
      if (stderr) {
        console.log(stderr)
        process.exit(1)
      }
    })
})()
