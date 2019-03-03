
const express = require('express');
const app = express();
const path = require('path')

app.use(express.static(path.resolve('public')));

const server = require('http').createServer(app);

// socket.io 要依赖 http 服务器
let io = require('socket.io')(server)

// 默认的命名空间为/
io.of('/dev').on('connection', function (socket) {
  console.log('客户端已经连接');
  socket.on('message', function (msg) {
    console.log(msg);
    // socket.send('server:' + msg)
    // 向所有的客户端进行关播
    // 广播有两种，一种是包含自己，一种是不包含自己
    // io.emit('message') 向所有的客户端进行广播， 包括自己， 自己也能听到
    // socket.broadcast.emit() 向所有除了自己以外的客户端进行广播(同一个命名空间下的)
    // io.of('/dev').emit('message', msg)
    socket.broadcast.emit('message', msg)
  })
})

io.of('/chat').on('connection', function (socket) {
  console.log('客户端已经连 接');
  let roomName;
  socket.on('message', function (msg) {
    console.log(msg);
    // socket.send('server:' + msg)
    // 向所有的客户端进行关播
    io.of('/chat').in(roomName).emit('message', msg)
  })
  // 监听客服端想进入 某个房间的事件
  socket.on('join', function (name) {
    roomName = name;
    socket.join(name);
  })

  socket.on('leave', function (name) {
    socket.leave(name);
    roomName = null;
  })
})

server.listen(8080);
