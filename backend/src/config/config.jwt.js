/**
 * Configuration settings for JSON Web Tokens (JWT) used in the SOIL Organic application.
 *
 * This module exports the secret key used to sign the JWT, along with other token
 * related configurations like expiration time and session settings.
 * 
 * @module config/jwt
 */

module.exports = {
    // Secret key for JWT signing and encryption. Keep it secure.
    // Do not expose this key publicly in your application.
    jwtSecret: 'xyjvjSKtdViBsFFdvoYfg0A8vUCQji6Jl_8hB2TSX3RYPHr7RIjZc5kybondtZCcyzXkbzM_ejOUYhGOAFJQhA',

    // Options for JWT sessions. Here, session management is disabled.
    jwtSession: {
      session: false
    },

    // Token expiration setting. Defines how long after issuance a token becomes invalid.
    jwtExpiration: '1h' // Tokens expire after 1 hour
  };