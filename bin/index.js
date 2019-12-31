#!/usr/bin/env node

'use strict'

const desync = require('./desync')

desync()
  .catch(err => console.error(err.message) || 1)
  .then(process.exit)
