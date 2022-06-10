const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
let count = 0;


const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "./index.html");
  const readStream = fs.createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);

io.on("connection", (client) => {
  let name = '';
  count++;

  console.log("Connected. Total connections: ", count);
  client.on("newUser", (data) => {
    name = data;
    console.log(name);
    client.emit('infoUpdate', count);
    client.broadcast.emit('infoUpdate', count);
    client.broadcast.emit("newUser", data);
  });

  client.on("newMessage", (data) => {
    console.log(data);
    client.broadcast.emit("newMessage", data);
    client.emit("newMessage", data);
  });

  client.on("disconnecting", (reason) => {
    count--;
    console.log("Disonnected: ", name);
    client.broadcast.emit('infoUpdate', count);
    client.broadcast.emit("userLeft", name);
  });

});

server.listen(8085);
