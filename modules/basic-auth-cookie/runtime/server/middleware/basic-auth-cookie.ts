import { Buffer } from 'node:buffer'
import { useRuntimeConfig } from '#imports'
// server/middleware/basic-or-session.ts
import { createError, defineEventHandler, getRequestHeader, getRequestIP, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const { enabled, users, cookieConfig } = useRuntimeConfig().basicAuthCookie
  if (!enabled) {
    return
  }

  // Validate X-Forwarded-Proto
  if (process.env.NODE_ENV === 'production' && getRequestHeader(event, 'x-forwarded-proto') !== 'https') {
    console.log('Insecure request, X-Forwarded-Proto is not https')
    return unauthorized(event)
  }

  // Check if user has a valid session
  const session = await getUserSession(event)
  if (session?.user?.isAuthenticated) {
    console.log(`User ${session.user.name} authenticated via session, ip:`, getRequestIP(event, { xForwardedFor: true }))
    return
  }

  // Basic auth should never be longer than 4096 bytes, must be present and start with "Basic "
  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader || authHeader.length > 4096) {
    console.log('Missing or too long Authorization header')
    return unauthorized(event)
  }
  const [scheme, authParam] = authHeader.split(' ')
  if (!scheme || !authParam || scheme.toLowerCase() !== 'basic') {
    return unauthorized(event)
  }

  // Validate user credentials
  const credentials = authParam && Buffer.from(authParam, 'base64').toString('utf8')
  if (credentials && users.includes(credentials)) {
    const [name] = credentials.split(':')
    setUserSession(event, { user: { name, isAuthenticated: true } }, cookieConfig)
    console.log(`User ${name} authenticated`, getRequestIP(event, { xForwardedFor: true }))

    return
  }

  console.log('Unauthorized request:', credentials)

  unauthorized(event)
})

function unauthorized (event: any, backoffMs = 100) {
  setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Secure Area", charset="UTF-8"')
  setResponseHeader(event, 'Cache-Control', 'no-store')
  if (backoffMs > 0) {
    // Small randomized delay to blunt brute force attacks
    const jitter = Math.floor(Math.random() * 50)
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, backoffMs + jitter)
  }
  throw createError({ statusCode: 401, statusMessage: 'Access denied' })
}
