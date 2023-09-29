const { exec } = require('child_process');
const { createServer } = require('http');
const { Server } = require('socket.io');

// define server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// define server variables
var port = 10942;
var addr = null;

// define application variables
var webInterface = null;
var remote = null;

// bind connection event
io.on('connection', function (socket) {
  // assign client type
  if (socket.handshake.headers['client-type'] == 'web-interface' && webInterface == null) {
    webInterface = socket;
    console.log('web-interface connected...');
    socket.emit('client-type', 'web-interface');
    socket.emit('server-ip', addr);
  } else if (socket.handshake.headers['client-type'] == 'remote' && remote == null) {
    remote = socket;
    console.log('remote connected...');
    socket.emit('client-type', 'remote');
  } else {
    socket.disconnect();
  }

  // unassign client on disconnect
  socket.on('disconnect', function () {
    if (webInterface === socket) {
      webInterface = null;
    } else if (remote === socket) {
      remote = null;
    }
  });

  // listen to cursor events
  socket.on('cursor-move', function (left, x, y) {
    if (webInterface === null)
      return;

    webInterface.emit('cursor-move', left, x, y);
  });

  socket.on('cursor-set', function (left, x, y) {
    if (webInterface === null)
      return;

    webInterface.emit('cursor-set', left, x, y);
  });

  socket.on('click', function (left) {
    if (webInterface === null)
      return;

    webInterface.emit('click', left);
  });

  socket.on('set-mode', function(single) {
    if (remote === null)
      return;

    remote.emit('set-mode', single);
  });
});

// gets the current machines address from the command line (designed for windows ipconfig command)
function getAddress() {
  return new Promise(function (resolve, reject) {
    exec('ipconfig', function (error, stdout, stderr) {
      const lineAddr = stdout.search('IPv4 Address');
      const line = stdout.substring(lineAddr).split('\n')[0];
      const addr = line.split(': ')[1].replace('\r', '');

      resolve(addr);
    });
  });
}

// calculates the address and port, then starts the server
async function runServer() {
  addr = await getAddress();

  // Start server
  httpServer.listen(port);
  console.log(`Listening locally on http://${addr}:${port}`);
}

runServer();