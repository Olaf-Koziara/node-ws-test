const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

const server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

const wss = new WebSocketServer({ server: server });
console.log("websocket server created");

wss.on("connection", function (ws) {
  wss.clients.forEach((client) => {
    console.log(client.id);
    client.send(JSON.stringify({ uid: client.id }));
  });

  console.log("websocket connection open");

  ws.on("close", function () {
    console.log("websocket connection close");
    clearInterval(id);
  });
});
