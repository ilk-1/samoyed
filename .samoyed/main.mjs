import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";


(async function main () {
    // 获取路径参数
    const hook_name = process.argv[2];
    console.debug(`当前正在执行 ${hook_name} 钩子`);

    // 配置文件地址
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    console.debug("当前脚本所在文件夹", __dirname);

    // 获取配置信息
    const configPath = path.join(__dirname, "..", ".samoyedrc.json");
    const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
    console.debug("成功获取萨摩耶配置信息", configData);

    // 获取当前钩子的配置
    const hookConfig = configData[hook_name];
    console.debug(`当前钩子的配置信息为`, hookConfig);
 
    // 获取暂存区文件信息
    const stashFileList = (await new Promise((resolve, reject) => {
        exec("git status -s", { windowsHide: true }, (error, stdout, stderr) => {
            if (error) reject(error);
            if (stdout) resolve(stdout);
            if (stderr) resolve(stderr);
        });
    })).split("\n").map((_) => _.slice(3));
    console.debug("暂存区文件信息", stashFileList);

    // 匹配钩子作用域
    const commands = [];
    for (const config of hookConfig) {
        const scopeExp = new RegExp(config.scope);
        for (const stashFile of stashFileList) {
            if (scopeExp.test(stashFile)) {
                config.commands.forEach((_) => commands.push(_));
                break;
            }
        }
    }
    console.debug("作用域匹配的全部命令", commands);

    // 执行全部命令
    const promiseList = [];
    for (const command of commands) {
        promiseList.push(new Promise((resolve, reject) => {
            exec(command, { windowsHide: true }, (error, stdout, stderr) => {
                if (error) reject(error);
                if (stdout) {
                    console.log(stdout);
                    resolve(stdout);
                };
                if (stderr) resolve(stderr);
            });
        }));
    }

    // 获取命令执行结果
    Promise.all(promiseList).then((values) => {
        console.debug(values);
        process.exit(0);
    }, (reason) => {
        console.error(reason);
        process.exit(1);
    });
})()
