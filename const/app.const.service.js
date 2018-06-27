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