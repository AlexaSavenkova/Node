// #!/usr/local/bin/node
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const readline = require('readline');
const inquirer = require('inquirer');
const { green } = require("colors/safe");

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

// выделяет зеленым цветом подстроку заданную ключом -f
const colorMatch = (filePath) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath)
    });
    const regExp = new RegExp(options.find, 'ig');
    const length = options.find.length;

    rl.on('line', function (line) {
        result = Array.from(line.matchAll(regExp));
        if (result.length == 0) {
            console.log(line);
        } else {
            newLine = [];
            let startIndex =0;
            result.forEach((item) => {
                chunk = line.substr(startIndex,item.index-startIndex);
                newLine.push(chunk);
                chunk = green(line.substr(item.index,length));
                newLine.push(chunk);
                startIndex = item.index + length;
            });
            chunk = line.substr(startIndex);
            newLine.push(chunk);
            console.log(newLine.join(''));
        }
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
                colorMatch(filePath);
            }
    } else {
        currentDirectory = path.join(currentDirectory, answer.fileName);
       main();
    }
};

main();