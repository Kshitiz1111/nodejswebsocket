const CONSTANTS = require('./websocket_constants')
const crypto = require('crypto')

function isOriginAllowed(origin) {
  return CONSTANTS.ALLOWED_ORIGINS.includes(origin)
}

function checkClientHandShakeProtocol(socket, upgradeHeaderCheck,
  connectionHeaderCheck,
  methodCheck,
  originCheck) {
  if (upgradeHeaderCheck && connectionHeaderCheck && methodCheck && originCheck) {
    return true;
  } else {
    const message = "400 bad request. The HTTP headers do not comply with the RFC 6455 spec.";
    const messageLength = message.length;
    const response = `HTTP/1.1 400 Bad Request\r\n` +
      `Content-Type: text/plain\r\n` +
      `Content-Length: ${messageLength}` +
      `\r\n` +
      message;

    socket.write(response, (err) => {
      if (err) console.error("Error writing to socket:", err.message)
    })
    socket.end();

  };
}

function generateServerKey(clientKey) {
  //join client key with guid
  let data = clientKey + CONSTANTS.GUID;
  //hash the data
  const hash = crypto.createHash('sha1');
  hash.update(data);
  //final step is to digest the data into base64
  let serverKey = hash.digest('base64');
  return serverKey
}

function createUpgradeHeaders(clientKey) {
  //generate the server accept key
  let serverKey = generateServerKey(clientKey);
  let headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-webSocket-Accept: ${serverKey}`
  ]
  const upgradeHeaders = headers.join('\r\n') + '\r\n\r\n';
  return upgradeHeaders
}

module.exports = {
  isOriginAllowed,
  checkClientHandShakeProtocol,
  createUpgradeHeaders,
}