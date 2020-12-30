const ora = require('ora');

function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

const throbber = ora().start();

const enterReactGridProDir = 'cd ../ReactGrid-Pro &&';

const commands = [
    { cmd: 'npm run pre-deploy', title: 'Build JS' },
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
    for (const command of commands) {
        throbber.start(command.title);
        try {
            await execShellCommand(command.cmd);
            throbber.succeed(command.title);
        } catch (error) {
            throbber.fail(error);
            break;
        }
    }
    throbber.succeed('Task Complete');
    throbber.stop();
})();
