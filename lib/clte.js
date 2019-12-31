'use strict'

const detect = ({ hostname, pathname }) => [
  `POST ${pathname} HTTP/1.1`,
  'Host: ' + hostname,
  'Content-Length: 4',
  'Transfer-Encoding: chunked\r\n',
  '1',
  'Z',
  'Q'
].join('\r\n') + '\r\n\r\n'

const confirm = ({ hostname, pathname }) => {
  const body = [
    '1',
    'Z',
    '0\r\n',
    'GET /foobar HTTP/1.1',
    'Host: ' + hostname,
    'X-Foo: bar\r\n\r\n'
  ].join('\r\n')

  return [
    `POST ${pathname} HTTP/1.1`,
    'Host: ' + hostname,
    'Content-Length: ' + body.length,
    'Transfer-Encoding: chunked\r\n',
    body + `GET ${pathname} HTTP/1.1`,
    'Host: ' + hostname
  ].join('\r\n') + '\r\n\r\n'
}

module.exports = {
  detect,
  confirm
}
