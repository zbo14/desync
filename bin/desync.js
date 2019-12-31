'use strict'

const detect = require('../lib/detect')
const confirm = require('../lib/confirm')

module.exports = async () => {
  let url = process.argv[2]

  if (!url) {
    throw new Error('[code=<integer>] [verbose=true] desync <url>')
  }

  url = new URL(process.argv[2])
  const code = process.env.code ? +process.env.code : 404
  const verbose = (process.env.verbose || '').trim() === 'true'

  if (!Number.isInteger(code) || code < 100 || code >= 600) {
    throw new Error('Expected code to be an integer >= 100 and < 600')
  }

  const promises = ['clte', 'tecl'].map(async order => {
    try {
      await detect({ order, url })
      console.log(order + ': Detected!')
      await confirm({ order, url, code })
      console.log(order + ': Confirmed!')
    } catch (err) {
      verbose && console.log(order + ': ' + err.message)
    }
  })

  await Promise.all(promises)
  console.log('Done!')
}
