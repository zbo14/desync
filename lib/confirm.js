'use strict'

const clte = require('./clte')
const tecl = require('./tecl')
const util = require('./util')

module.exports = async ({ order, url, code }) => {
  const sock = await util.connect(url)
  const { confirm } = order === 'clte' ? clte : tecl
  const data = confirm(url)
  const promise = util.receiveTwo(sock)

  sock.write(data)

  const [, response] = await promise

  if (response.code !== code) {
    throw new Error(`Expected status code ${code}, got ${response.code}`)
  }
}
