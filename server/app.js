const HTTP = require('http');

const CONSTANTS = require('./custom_lib/websocket_constants');
const FUNCTIONS = require('./custom_lib/websocket_methods');

const HTTP_SERVER = HTTP.createServer((req, res) => {
  res.writeHead(200);
  res.end('server created')
});

HTTP_SERVER.listen(CONSTANTS.HTTP_PORT, () => {
  console.log('HTTP server listenting...');
})

//error handling
CONSTANTS.CUSTOM_ERRORS.forEach((errEvent) => {
  process.on(errEvent, (err) => {
    console.log(`Caught Error Event: ${errEvent}, error object: ${err}`);
    process.exit(1)
  })
})

HTTP_SERVER.on('upgrade', (req, socket, head) => {
  const upgradeHeaderCheck = req.headers.upgrade.toLowerCase() === CONSTANTS.UPGRADE;
  const connectionHeaderCheck = req.headers.connection.toLowerCase() === CONSTANTS.CONNECTION;
  const methodCheck = req.method === CONSTANTS.METHOD;

  //check the origin
  const origin = req.headers.origin;
  const originCheck = FUNCTIONS.isOriginAllowed(origin);

  //final check before before handling upgrade request 
  if (FUNCTIONS.checkClientHandShakeProtocol(socket, upgradeHeaderCheck, connectionHeaderCheck, methodCheck, originCheck)) {
    upgradeConnection(req, socket, head)
  }
})

function upgradeConnection(req, socket, head) {
  const clientKey = req.headers['sec-websocket-key'];
  const headers = FUNCTIONS.createUpgradeHeaders(clientKey);
  socket.write(headers);
  //if successful now you have a valid websocket connection 
  startWebSocketConnection(socket);
}

function startWebSocketConnection(socket) {

}
