'use strict'

const net = require('net')
const tls = require('tls')

const connect = url => new Promise((resolve, reject) => {
  const { protocol, hostname } = new URL(url)
  const secure = protocol === 'https:'
  const { connect } = secure ? tls : net
  const port = secure ? 443 : 80

  setTimeout(() => reject(new Error('Connect timeout')), 3e3)

  const sock = connect(port, hostname, { rejectUnauthorized: false }, () => resolve(sock))
    .once('error', reject)
})

const receiver = n => sock => new Promise((resolve, reject) => {
  const resps = []

  let data = ''

  const parseResponse = () => {
    const idx = data.search('\r\n\r\n')

    if (idx === -1) return

    let [status, ...headers] = data
      .slice(0, idx)
      .split('\r\n')
      .filter(Boolean)

    const code = +status.match(/\d{3}/)[0]

    headers = headers.reduce((obj, header) => {
      let [key, ...value] = header.split(':')
      key = key.trim().toLowerCase()
      value = value.join(':').trim()
      return { ...obj, [key]: value }
    }, {})

    const contentLength = +headers['content-length']

    if (Number.isNaN(contentLength)) {
      data = data.slice(idx + 4)
      return { status, headers, body: '' }
    }

    const body = data.slice(idx + 4, idx + 4 + contentLength)

    if (body.length < contentLength) return

    data = data.slice(idx + 4 + contentLength)

    return { code, status, headers, body }
  }

  const listener = chunk => {
    data += chunk.toString('ascii')
    const resp = parseResponse()
    if (!resp) return
    resps.push(resp)
    if (resps.length !== n) return
    resolve(resps)
    sock.removeListener('data', listener)
  }

  sock
    .on('data', listener)
    .once('error', reject)

  setTimeout(() => reject(new Error('Receive timeout')), 5e3)
})

const receiveOne = receiver(1)
const receiveTwo = receiver(2)

module.exports = {
  connect,
  receiveOne,
  receiveTwo
}
