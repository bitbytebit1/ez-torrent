// server/middleware/basic-or-session.ts
import { createError, defineEventHandler, getRequestHeader, setResponseHeader } from "h3";
import { Buffer } from "buffer";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const { enabled, users, cookieConfig } = useRuntimeConfig().basicAuthCookie;
  if (!enabled) {
    return
  }

  // Validate X-Forwarded-Proto
  if (process.env.NODE_ENV === "production" && getRequestHeader(event, "x-forwarded-proto") !== "https") {
    return unauthorized(event);
  }

  // Check if user has a valid session
  const session = await getUserSession(event);
  if (session?.user?.isAuthenticated) {
    setResponseHeader(event, "Cache-Control", "no-store, private, max-age=0");
    setUserSession(event, session, cookieConfig);
    return
  }

  // Basic auth should never be longer than 4096 bytes, must be present and start with "Basic "
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader || authHeader.length > 4096) {
    return unauthorized(event);
  }
  const [scheme, authParam] = authHeader.split(" ");
  if (!scheme || !authParam || scheme.toLowerCase() !== "basic") {
    return unauthorized(event);
  }

  // Validate user credentials
  const credentials = authParam && Buffer.from(authParam, "base64").toString("utf8");
  if (credentials && users.some(validCredentials => validCredentials === credentials)) {
    const [name] = credentials.split(":");
    setUserSession(event, { user: { name, isAuthenticated: true } }, cookieConfig);
    return
  }

  console.log('Unauthorized request:', credentials);

  unauthorized(event);
});


function unauthorized(event: any, backoffMs = 100) {
  setResponseHeader(event, "WWW-Authenticate", 'Basic realm="Secure Area", charset="UTF-8"');
  setResponseHeader(event, "Cache-Control", "no-store")
  if (backoffMs > 0) {
    // Small randomized delay to blunt brute force attacks
    const jitter = Math.floor(Math.random() * 50);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, backoffMs + jitter);
  }
  throw createError({ statusCode: 401, statusMessage: 'Access denied' });
}