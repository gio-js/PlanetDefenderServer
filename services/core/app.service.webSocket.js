const redis = require('redis');
const serviceConst = require('../../const/app.const.service');

class WebSocketService {

    constructor(server) {
        this.service = socketIO(server);
        this.channels = {}; // dictionary of <channelId, io.Namespace>
    }

    /**
     * Create a namespace channel
     */
    createChannel(channelId, message) {
        var namespaceChannel = io.of('/' + channelId);
        
        // events
        namespaceChannel.on('connection', function (socket) {
            console.log('new connection on channel: ' + channelId + ', socket id: ' + socket.id); // remove closure

            socket.on('disconnecting', function (reason) {
                console.log('socket disconnecting: ' + socket.id); // remove closure
            });

            socket.on('disconnect', function (reason) {
                console.log('socket disconnected: ' + socket.id); // remove closure
            });
        });

        this.channels[channelId] = namespaceChannel;
    }

    /**
     * Send message to the specified channel
     */
    sendMessage(channelId, eventName, message) {
        var namespaceChannel = this.channels[channelId];
        if (!namespaceChannel) {
            throw new Error("Namespace channel not found.");
        }

        namespaceChannel.emit(eventName, message);
    }

    /**
     * Dispose function, removes any internal resource pointer
     */
    dispose() {
        if (this.service) {
            this.service.close();
            this.service = null;
        }
        this.channels = null;
    }

}

exports.default = PubSubService;