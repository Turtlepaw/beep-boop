/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const exec_promise = require('child_process').exec;
const { promisify } = require("util");
const exec_ = promisify(exec_promise);
require("colors");
async function exec(cmd, cb) {
    return await exec_(cmd).then((value) => cb(
        value.stdout.includes("error") || value.stdout.includes("warning"), value.stdout, value.stderr));
}


let prevConsole = "";

(async () => {
    clearConsole();
    let failed = false;
    function log(...args) {
        prevConsole += args[0];
        return console.log(...args);
    }
    function clearConsole() {
        process.stdout.write(
            process.platform === 'win32' ? '\x1B[2J\\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
        );
        if (prevConsole != "") console.log(prevConsole);
    }

    console.log("Linting...".gray);
    await exec("yarn lint", async function (error, stdout, stderr) {
        if (error == false) {
            clearConsole();
            return log("Linting success...".green);
        }
        else {
            clearConsole();
            failed = true;
            return console.log("Linting failed:".red, stdout);
        }
    });

    if (failed) return;
    console.log("Building...".gray);
    await exec("yarn build", async function (error, stdout, stderr) {
        if (error == false) {
            clearConsole();
            return log("Building success...".green);
        }
        else {
            clearConsole();
            failed = true;
            return console.log("Building Failed:".red, stdout);
        }
    });

    if (failed) return;
    console.log("Starting bot...".gray);
    await exec("yarn run-bot", async function (error, stdout, stderr) {
        if (error == false) {
            // clearConsole();
            return console.log(stdout);
        }
        else {
            failed = true;
            return console.log("Failed Starting Bot:\\n".red, stdout);
        }
    });
})();