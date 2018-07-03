const redis = require('redis');
const serviceConst = require('../../const/app.const.service');
const { promisify } = require('util');

class PubSubService {

    constructor() {
        this.service = redis.createClient(serviceConst.REDIS_URL);
        this.getAsync = promisify(this.service.get).bind(this.service);
    }

    /**
     * Channel subscribe
     */
    subscribe(channelId, messageCallback) {
        this.service.subscribe(channelId);
        this.service.on("message", (channel, message) => {
            if (messageCallback)
                messageCallback(message);
        });
    }

    /**
     * Publish a new channel message
     */
    publish(channelId, message) {
        this.service.publish(channelId, message);
    }

    /**
     * Store data by id
     */
    store(id, dataObject) {
        this.service.set(id, JSON.stringify(dataObject));
    }

    /**
     * Store data by id
     */
    get(id) {
        return this.getAsync(id);
    }

    /**
     * Returns native redis service
     */
    getNativeService() {
        return this.service;
    }

    /**
     * Dispose function, removes any internal resource pointer
     */
    dispose() {
        if (this.service) {
            this.service.dispose();
            this.service = null;
        }
    }

}

exports.Class = PubSubService;