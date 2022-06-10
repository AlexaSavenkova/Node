// #!/usr/local/bin/node
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const inquirer = require('inquirer');
const worker_threads = require('worker_threads');

const options = yargs.usage("Usage: -p <path>, -f <find>")
    .option('p', {
        alias: 'path',
        describe: 'Path to directory',
        type: "string",
        default: process.cwd(),
    })
    .option('f', {
        alias: 'find',
        describe: 'String to find',
        type: "string",
        default: '',
    }).argv;

let currentDirectory = options.path;

if (!fs.existsSync(currentDirectory)) {
    console.log('Wrong path to directory');
    process.exit(1);
}

const isFile = (fileName) => {
    return fs.lstatSync(fileName).isFile();
};


const colorMatch = (filePath) => {
    return new Promise((resolve, reject) => {
        const regExp = new RegExp(options.find, 'ig');
        const length = options.find.length;
        const worker = new worker_threads.Worker('./worker.js', {
            workerData:
                {'filePath': filePath,
                'regExp': regExp,
                'length': length },
        });

        worker.on('message', resolve);
        worker.on('messageerror', reject);
    });
};

const main = async () => {
    const list = fs.readdirSync(currentDirectory);
    const answer = await inquirer.prompt([
        {
            name: "fileName",
            type: "list",
            message: "Choose file or directory:",
            choices: list,
        },
    ]);
    let filePath = path.join(currentDirectory, answer.fileName);

    if(isFile(filePath)) {
            if(options.find == null) {
                const data = fs.readFileSync(filePath, "utf8");
                console.log(data);
            } else {
                await colorMatch(filePath);
            }
    } else {
        currentDirectory = path.join(currentDirectory, answer.fileName);
       main();
    }
};

main();