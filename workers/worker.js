const worker_threads = require('worker_threads');
const {green} = require("colors/safe");
const readline = require('readline');
const fs = require('fs');

// выделяет зеленым цветом подстроку заданную ключом -f
const filePath = worker_threads.workerData.filePath;
const rl = readline.createInterface({
    input: fs.createReadStream(filePath)
});
const regExp = worker_threads.workerData.regExp;
const length = worker_threads.workerData.length;

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

