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

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};
wss.on("connection", (ws) => {
  if (!ws.id) {
    ws.id = wss.getUniqueID();
  }
  wss.clients.forEach((client) => {
    console.log(client.id);
    client.send(JSON.stringify({ uid: client.id }));
  });

  ws.on("message", (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        const uid = JSON.parse(data).uid;

        if (uid === client.id) {
          client.send(data);
        }
      }
    });
  });
});
