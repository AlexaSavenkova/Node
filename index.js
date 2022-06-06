const http = require('http');
const path = require('path');
const fs = require('fs');

const isFile = (path) => fs.lstatSync(path).isFile();

const server = http.createServer((req, res) => {
    let fullPath = path.join(process.cwd(), req.url);
    let htmlFile = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    if (!fs.existsSync(fullPath)) {
        htmlFile = htmlFile.replace('{{content}}', 'There is no such file or directory');
        res.writeHead(404, 'There is no such file or directory',{
            'Content-Type': 'text/html'
        });
        return res.end(htmlFile);
    }
    if (isFile(fullPath)) {
        res.writeHead(200, 'show file content');
        return fs.createReadStream(fullPath,'utf-8').pipe(res);
    }

    let list = '<ul>';
    fs.readdirSync(fullPath).forEach((name) => {
        fullPath = path.join(req.url, name);
        list += `<li><a href="${fullPath}">${name}</a></li>`;
    });
    list += '</ul>';
    htmlFile = htmlFile.replace('{{content}}', list);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    return res.end(htmlFile);
});

server.listen(8085);
