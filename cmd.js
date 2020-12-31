const ora = require('ora');
const { exec } = require('child_process');

function execShellCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command.cmd, (error, stdout, stderr) => {
            if (error) {
                reject({ cmd: command, error: stderr });
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

const throbber = ora().start();

const enterReactGridProDir = 'cd ../ReactGrid-Pro &&';

const commands = [
    { cmd: 'npm run pre-deploy', title: 'Build JS with Rollup' },
    { cmd: 'rm -rf ../dist', title: 'Wipe ../dist directory' },
    { cmd: 'cp -r dist ..', title: 'Copy JS files to dist directory' },
    { cmd: 'rm -rf ../ReactGrid-Pro/node_modules/@silevis', title: 'Remove old ReactGrid MIT package' },
    { cmd: enterReactGridProDir + 'npm i ./../dist --force --save-dev', title: 'Install MIT package in PRO' },
    { cmd: enterReactGridProDir + 'npm i react react-dom --no-save', title: 'Install missing dependencies' },
    { cmd: enterReactGridProDir + 'npm run copy:mit:tests', title: 'Copy MIT Cypress files' },
    { cmd: enterReactGridProDir + 'npm run copy:styles', title: 'Copy MIT styles' },
    { cmd: enterReactGridProDir + 'npm run copy:reactgrid:TestGrid', title: 'Copy MIT TestGrid component' },
];

setTimeout(() => { }, 0);

(async function () {
    throbber.info('Running building process...');
    try {
        for (const command of commands) {
            throbber.start(command.title);
            await execShellCommand(command);
            throbber.succeed(command.title);
        }
    } catch (e) {
        throbber.fail(e.cmd.title);
        throbber.info(e.error);
        throbber.fail('Build finished with an error!');
    }
    throbber.stop();
})();
