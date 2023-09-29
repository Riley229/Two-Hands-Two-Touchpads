const { createServer } = require('http');
const { Server } = require('socket.io');

// define server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// define application variables
var webInterface = null;
var remote = null;

// bind connection event
io.on('connection', function(socket) {
  // assign client type
  if (socket.handshake.headers['client-type'] == 'web-interface' && webInterface == null) {
    webInterface = socket;
    console.log('web-interface connected...');
    socket.emit('client-type', 'web-interface');
  } else if (socket.handshake.headers['client-type'] == 'remote' && remote == null) {
    remote = socket;
    console.log('remote connected...');
    socket.emit('client-type', 'remote');
  } else {
    socket.disconnect();
  }

  // unassign client on disconnect
  socket.on('disconnect', function() {
    if (webInterface === socket) {
      webInterface = null;
    } else if (remote === socket) {
      remote = null;
    }
  });

  // listen to cursor events
  socket.on('cursor-move', function(left, x, y) {
    if (webInterface === null)
      return;

    webInterface.emit('cursor-move', left, x, y);
  });

  socket.on('cursor-set', function(left, x, y) {
    if (webInterface === null)
      return;

    webInterface.emit('cursor-set', left, x, y);
  });

  socket.on('click', function(left) {
    if (webInterface === null)
      return;

    webInterface.emit('click', left);
  });
});

// start server
const port = 10942;
httpServer.listen(port);
console.log(`Listening on port ${port} ...`);