const { v4: uuidv4 } = require('uuid');

/* Simple class to create a session token */
class Session {
    constructor(username, expiresAt) {
        this.username = username
        this.expiresAt = expiresAt
    }

	/* Determine if session has expired */
    isExpired() {
        this.expiresAt < (new Date())
    }
}

/* We save locally all the session tokens */
const sessions = {}

const generateSession = (username) => {
    /* Crating a session token that lasts 30 minutes */
    const sessionToken = uuidv4()
    const now = new Date()
    const expiresAt = new Date(+ now + 360 * 1000)

    /* We create and store the info inside "sessions" */
    const session = new Session(username, expiresAt)
    sessions[sessionToken] = session

    /* We send the cookie to the user's browser */
    return {"sessionToken": sessionToken, "expiresAt": expiresAt}
}

/* Returns false if the cookie is not valid, true if it's ok */
const validateSession = (cookies) => {
    /* Various checks to see that the cookie is present and valid */
    if (!cookies) {
        return false
    }

    const sessionToken = cookies['session_token']
    if (!sessionToken) {
        return false
    }

    userSession = sessions[sessionToken]
    if (!userSession) {
        return false
    }

    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        return false
    }

    return true
}

/* Verifies that the cookie is valid and then it will regenerate it */
const refreshSession = (cookies) => {
    /* Various checks to see that the cookie is present and valid */
    if (!cookies) {
        return false
    }

    const sessionToken = cookies['session_token']
    if (!sessionToken) {
        return false
    }

    userSession = sessions[sessionToken]
    if (!userSession) {
        return false
    }
    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        return false
    }
   
    /* If the cookie is valid it will regenerate it */
    const newSessionToken = uuidv4()
    const now = new Date()
    const expiresAt = new Date(+now + 1800 * 1000)

    /* We create and store the info inside "sessions" */
    const session = new Session(userSession.username, expiresAt)
    sessions[newSessionToken] = session

    /* We send the cookie to the user's browser */
    return {"sessionToken": newSessionToken, "expiresAt": expiresAt}
}

/* Verifies that the cookie is valid and then deletes it */
const logoutSession = (cookies) => {
    /* Various checks to see that the cookie is present and valid */
    if (!cookies) {
        return false
    }

    const sessionToken = cookies['session_token']
    if (!sessionToken) {
        return false
    }

    delete sessions[sessionToken]

    return true
}

module.exports = { generateSession, validateSession, refreshSession, logoutSession }