// 需要 node 启动该服务  node socket.js
let ws = require("nodejs-websocket");
console.log("开始建立链接");
const server = ws
  .createServer(function(conn) {
    conn.on("text", function(obj) {
      console.log("收到的信息为", obj);
      sendAll(obj);
    });
    conn.on("close", function(code, reason) {
      console.log("关闭连接");
    });
    conn.on("error", function(code, reason) {
      console.log("异常关闭");
    });
  })
  .listen(8081);
console.log("链接建立完毕");

function sendAll(obj) {
  server.connections.forEach(function(conn) {
    conn.send(obj);
  });
}
