const redis = require('redis');
const serviceConst = require('../../const/app.const.service');

class PubSubService {

    constructor() {
        this.service = redis.createClient(serviceConst.REDIS_URL);
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
     * Dispose function, removes any internal resource pointer
     */
    dispose() {
        if (this.service) {
            this.service.dispose();
            this.service = null;
        }
    }

}

exports = PubSubService;