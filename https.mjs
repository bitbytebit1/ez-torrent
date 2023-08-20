#!/bin/env/node
import fs from 'node:fs'

process.env.NITRO_SSL_CERT = fs.readFileSync('localhost.pem')
process.env.NITRO_SSL_KEY = fs.readFileSync('localhost-key.pem')

await import('./.output/server/index.mjs')
