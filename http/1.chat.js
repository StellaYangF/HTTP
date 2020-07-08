let net = require('net');
// 广播 b
// 私聊 c: 对方的用户名内容
// 列出在线用户列表 l
// 修改昵称 n:名字
let clients = {};
let server = net.createServer(function(socket) {
    let key = socket.remoteAddress + socket.remotePort;
    clients[key] = {
        nickname: '匿名',
        socket,
    };
    function broadcast(text) {
        let nickname = clients[key];
        for (let user in clients) {
            if (clients.hasOwnProperty(user)) {
                clients[user].write(`${nickname}:${text}`);
            }
        }
    }
});

server.listen(8000);