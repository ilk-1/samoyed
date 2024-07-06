import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';


(async () => {
    const argv = process.argv;
    const hook_name = argv[2];

    if (!["pre-commit", "commit-msg"].includes(hook_name)) {
        console.warn(`Sorry, there is not the ${hook_name} hook.`)
        process.exit(1);
    } else {
        console.log(`Starting ${hook_name} hook...`)
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const configPath = path.join(__dirname, "..", ".samoyedrc.json");

    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const hookConfigData = configData[hook_name]
    console.log(hookConfigData)

    // exec('git status -s')

    const tmpContent = ""
 
    exec('git status -s', { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行的错误: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`shell错误: ${stderr}`);
            return;
        }
        const stashFileList = stdout.split("\n").map((file) => file.slice(3));
        stashFileList.forEach((file) => {
            console.log(file);
        })
        const hookFiltered = hookConfigData.map((hookConfig) => {
            for (const stashFile of stashFileList) {
                if (new RegExp(hookConfig.scope).test(stashFile)) {
                    console.log("匹配成功", hookConfig.scope, stashFile)
                    return hookConfig.commands;
                }
            }
            return []
        })
        console.log("pipei")
        console.log(`匹配`, hookFiltered)

        // flatten
        const commands = [];
        hookFiltered.forEach((hooks) => {
            hooks.forEach(cmd => commands.push(cmd));
        })
        console.log(commands);

        fs.writeFileSync(path.join(__dirname, 'cmd_tmp'), commands.join("\n"))

        const cmd_tmp = fs.readFileSync(path.join(__dirname, 'cmd_tmp'), 'utf-8');
        let commands_run = cmd_tmp.split("\n");
        commands_run.forEach((cmd) => {
            console.log("zhixing", cmd)
            exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
                if (error) console.log(error);
                if (stdout) console.log(stdout)
                if (stderr) console.log(stderr)
            })
        })

        // process.exit(1)
    });
})()
