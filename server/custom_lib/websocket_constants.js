module.exports = {
  HTTP_PORT: 8080,
  CUSTOM_ERRORS: [
    'uncaughtException',
    'unhandledRejection',
    'SIGINT'
  ],
  // header checks
  METHOD: 'GET',
  VERSION: 13,
  CONNECTION: 'upgrade',
  UPGRADE: 'websocket',
  ALLOWED_ORIGINS: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'null'//this allow to use the file protocol to view html and established a ws connection
  ],
  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',

}