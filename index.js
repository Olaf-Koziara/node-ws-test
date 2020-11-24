var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({ server: server });
console.log("websocket server created");

wss.on("connection", function (ws) {
  ws.id = 1;
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
