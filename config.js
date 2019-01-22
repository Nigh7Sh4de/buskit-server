/** This is a clone-dependent config file */
/**
 * Example file
 * 
 * These are example settings to use in a development environment.
 * The API uri and it's frontend CORS consumer are set to localhost.
 * Update each one to match your setup accordingly.
 * 
 */

const PUBLIC_URI = 'https://api.buskit.live'
const CORS_ORIGIN = 'https://www.buskit.live'

/**
 * The export will use the consts to generate a functioning config object
 */
module.exports = {
  SECRET_KEY: 'buskit-thesecretestkeyofkeys',
  PUBLIC_URI,
  CORS_ORIGIN,
  DB_CONNECTION_STRING: "mongodb://localhost/buskit",
  twitch: {
    REDIRECT_URI: `${CORS_ORIGIN}/redirect`,
    CLIENT_ID: 'zeod52e6vf639p7ztytpuekmyucm2n',
    CLIENT_SECRET: 'n5i3yuhfki8u9mllimmk9l6hetvgvt',
    ISSUER: 'live.buskit',
    api: {
      token: 'https://id.twitch.tv/oauth2/token',
      users: 'https://api.twitch.tv/helix/users',
      streams: 'https://api.twitch.tv/helix/streams',
      webhooks: 'https://api.twitch.tv/helix/webhooks/hub',
    }
  },
}
