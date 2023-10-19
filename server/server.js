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
var textSuggestions = false;

// define timer and session management variables
var inSession = false;
var sessionStart = null;
var participantId = null;

// runs to end session timer and write info to file
function handleSessionStart() {
  if (inSession && sessionStart == null)
    sessionStart = Date.now();
}

function handleSessionEnd(word, charsEntered, usedSuggestion) {
  const sessionEnd = Date.now();
  const delta = sessionEnd - sessionStart;
  inSession = false;
  sessionStart = null;

  // TODO: write to csv file
  //  - filename: "Participant_Data.csv"
  //  - if file doesn't exist, write header row: "Participant Id,Input Mode,Suggestions Enabled,Text Input,Chars Entered (With Errors),Used Suggestion,Time Taken (ms)"
  console.log(`${participantId},${singleInputMode ? "Single-cursor" : "Dual-cursor"},${textSuggestions ? "Enabled" : "Disabled"},${word},${charsEntered},${usedSuggestion ? "Yes" : "No"},${delta}`);

  if (webInterface == null) return;
  webInterface.emit("cursor-reset");

  if (remote == null) return;
  remote.emit("hide-timer-button", false);
}

// setup web interface client bindings
function setupInterfaceSocket(socket) {
  // assign socket and send starting information
  webInterface = socket;
  console.log("web-interface connected...");

  // send current server IP address and input modes
  const displayIP = remote === null ? addr : null;
  socket.emit("display-ip", displayIP);
  socket.emit("set-mode", singleInputMode);
  socket.emit("set-absolute", absolutePositioning);
  socket.emit("set-suggestions", textSuggestions);
  webInterface.emit("set-participant", participantId);

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

  // listen for text suggestion change events
  socket.on("set-suggestions", function(suggestionsEnabled) {
    textSuggestions = suggestionsEnabled;
    webInterface.emit("set-suggestions", textSuggestions);
  })

  // listen for enter pressed to end current session
  socket.on("enter-pressed", function(input, charsEntered, autosuggest) {
    handleSessionEnd(input, charsEntered, autosuggest);
  });

  // listen for "set-participant" events to set session variables
  socket.on("set-participant", function(participant) {
    participantId = participant;
    webInterface.emit("set-participant", participantId);
  });
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
    handleSessionStart();
  });

  socket.on("cursor-set", function (left, x, y) {
    if (webInterface === null) return;
    webInterface.emit("cursor-set", left, x, y);
    handleSessionStart();
  });

  socket.on("activate", function (left) {
    if (webInterface === null) return;
    webInterface.emit("activate", left);
    handleSessionStart();
  });

  socket.on("click", function (left) {
    if (webInterface === null) return;
    webInterface.emit("click", left);
    handleSessionStart();
  });

  // listen for session information
  socket.on("start-session", function() {
    inSession = true;
    remote.emit("hide-timer-button", true);

    if (webInterface == null) return;
    webInterface.emit("reset-input");
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
