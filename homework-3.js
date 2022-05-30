// Напишите программу, которая находит в этом файле все записи с ip-адресами 89.123.1.41 и 34.48.240.111,
// а также сохраняет их в отдельные файлы с названием %ip-адрес%_requests.log.
const fs = require("fs");
const {Transform} = require("stream");
const ipList = ['89.123.1.41', '34.48.240.111'];
const readStream = fs.createReadStream("./access.log", "utf8");

ipList.forEach((ip) => {
    const targetFile = `./${ip}_requests.log`;
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            let transformedChunk = '';
            // разбирваем на строки, потом каждую строку проверяем на вхождение ip
            const lines = chunk.toString().split('\n');
            lines.forEach((line) => {
                if (line.includes(ip)) {
                    transformedChunk += line + '\n';
                }
            });

            callback(null, transformedChunk);
        },
    });
    const writeStream = fs.createWriteStream(targetFile, {encoding: "utf-8"});

    readStream.pipe(transformStream).pipe(writeStream);
});

console.log("Запись завершена!");