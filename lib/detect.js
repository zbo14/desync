'use strict'

const clte = require('./clte')
const tecl = require('./tecl')
const util = require('./util')

module.exports = async ({ order, url }) => {
  const sock = await util.connect(url)
  const { detect } = order === 'clte' ? clte : tecl
  const data = detect(url)
  const promise = util.receiveOne(sock)

  sock.write(data)

  try {
    const [response] = await promise
    throw new Error('Expected timeout, got response with status code ' + response.code)
  } catch (err) {
    if (err.message !== 'Receive timeout') {
      throw err
    }
  }
}
