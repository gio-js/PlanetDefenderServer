/**
 * Default sever listening port
 */
exports.LISTENING_PORT = process.env.PORT || 3000;

/**
 * Base url service
 */
exports.BASE_URL_SERVICE = '/api/v1';

/**
 * Mongo DB connection
 */
exports.MONGO_URL = process.env.MONGODB_URI;

/**
 * Mongo database
 */
exports.MONGO_DATABASE = 'heroku_ft8gnss5';

/**
 * Redis connection
 */
exports.REDIS_URL = process.env.REDIS_URL;

/**
 * Authentication token secret
 */
exports.AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET;

/**
 * Authentication token expiration
 */
exports.AUTH_TOKEN_EXPIRATION_TIME = 1800; // 30 min.