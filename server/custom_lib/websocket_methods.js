const CONSTANTS = require('./websocket_constants')

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

    socket.write(response);
    socket.end()// this will close the TCP connection and keep the server running
  };
}

module.exports = {
  isOriginAllowed,
  checkClientHandShakeProtocol,
}