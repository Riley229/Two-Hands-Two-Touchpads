const { createServer } = require("http");
const { Server } = require("socket.io");
const { networkInterfaces } = require("os");

// define server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// define application variables
var webInterface = null;
var remote = null;
var singleInputMode = true;
var absolutePositioning = false;
var timerEnabled = false;

// setup web interface client bindings
function setupInterfaceSocket(socket) {
  // assign socket and send starting information
  webInterface = socket;
  console.log("web-interface connected...");

  // send current server IP address and input mode
  const displayIP = remote === null ? addr : null;
  socket.emit("display-ip", displayIP);
  socket.emit("set-mode", singleInputMode);
  socket.emit("set-absolute", absolutePositioning);
  socket.emit("set-timer", timerEnabled);

  // unassign interface client on disconnect
  socket.on("disconnect", function () {
    webInterface = null;
    console.log("web interface disconnected...");
  });

  // listen for mode change events and forward to remote
  socket.on("set-mode", function (singleInput) {
    singleInputMode = singleInput;
    webInterface.emit("set-mode", singleInputMode);

    if (remote === null) return;
    remote.emit("set-mode", singleInputMode);
  });

  // listen for absolute-positioning change events and forward to remote
  socket.on("set-absolute", function (absolute) {
    absolutePositioning = absolute;
    webInterface.emit("set-absolute", absolutePositioning);

    if (remote === null) return;
    remote.emit("set-absolute", absolutePositioning);
  });

  socket.on("set-timer", function (enabled) {
    timerEnabled = enabled;
    webInterface.emit("set-timer", timerEnabled);

    if (remote === null) return;
    remote.emit("");
  })
}

// setup remote client bindings
function setupRemoteSocket(socket) {
  // assign socket
  remote = socket;
  console.log("remote connected...");

  // send current remote mode
  socket.emit("set-mode", singleInputMode);
  socket.emit("set-absolute", absolutePositioning);

  // update current server IP address on web interface
  if (webInterface === null) return;
  webInterface.emit("display-ip", null);

  // unassign remote client on disconnect
  socket.on("disconnect", function () {
    remote = null;
    console.log("remote disconnected...");

    // update current server IP address on web interface
    if (webInterface === null) return;
    webInterface.emit("display-ip", addr);
  });

  // listen to cursor events and forward to web interface
  socket.on("cursor-move", function (left, x, y) {
    if (webInterface === null) return;
    webInterface.emit("cursor-move", left, x, y);
  });

  socket.on("cursor-set", function (left, x, y) {
    if (webInterface === null) return;
    webInterface.emit("cursor-set", left, x, y);
  });

  socket.on("activate", function (left) {
    if (webInterface === null) return;
    webInterface.emit("activate", left);
  });

  socket.on("click", function (left) {
    if (webInterface === null) return;
    webInterface.emit("click", left);
  });
}

// returns the current machines IP address
function getAddress() {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const v4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === v4Value && !net.internal) results.push(net.address);
    }
  }

  return results[0];
}

// bind connection event
io.on("connection", function (socket) {
  // assign client type
  const clientType = socket.handshake.headers["client-type"];
  if (clientType == "web-interface" && webInterface == null) {
    setupInterfaceSocket(socket);
  } else if (clientType == "remote" && remote == null) {
    setupRemoteSocket(socket);
  } else {
    socket.disconnect();
  }
});

// define server variables
const port = 10942;
const addr = getAddress();

// start the server
httpServer.listen(port);
console.log(`Listening locally on http://${addr}:${port}`);
