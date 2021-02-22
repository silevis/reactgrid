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
    { cmd: 'npm run pre-deploy', title: 'Building output Javascript with Rollup' },
    { cmd: 'rm -rf ../dist', title: 'Wiping ../dist directory' },
    { cmd: 'cp -r dist ..', title: 'Copying JS files to dist directory' },
    { cmd: 'rm -rf ../ReactGrid-Pro/node_modules/@silevis', title: 'Removing old ReactGrid MIT package' },
    { cmd: enterReactGridProDir + 'npm i ./../dist --force', title: 'Instaling MIT package in PRO' },
    { cmd: enterReactGridProDir + 'npm i react react-dom --no-save', title: 'Instaling missing dependencies' },
    { cmd: enterReactGridProDir + 'npm run copy:mit:styles && npm run copy:mit:tests && npm run copy:mit:TestGrid', title: 'Copying files' },
];

async function run() {
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
}

run();
