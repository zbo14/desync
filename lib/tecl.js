'use strict'

const detect = ({ hostname }) => [
  'POST / HTTP/1.1',
  'Host: ' + hostname,
  'Content-Length: 6',
  'Transfer-Encoding: chunked\r\n',
  '0\r\n',
  'X'
].join('\r\n') + '\r\n\r\n'

const confirm = ({ hostname }) => {
  const chunk = [
    'GET /foobar HTTP/1.1',
    'Host: ' + hostname
  ].join('\r\n') + '\r\n\r\n'

  const contentLength = 2 + ('' + chunk.length).length

  return [
    'POST / HTTP/1.1',
    'Host: ' + hostname,
    'Content-Length: ' + contentLength,
    'Transfer-Encoding: chunked\r\n',
    chunk.length,
    chunk,
    '0\r\n',
    'GET / HTTP/1.1',
    'Host: ' + hostname
  ].join('\r\n') + '\r\n\r\n'
}

module.exports = {
  detect,
  confirm
}
