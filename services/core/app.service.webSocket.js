const socketIO = require('socket.io');

class WebSocketService {

    constructor(server) {
        this.service = socketIO(server);
        this.channels = {}; // dictionary of <channelId, io.Namespace>
        this.messageCallback = null;
    }

    /**
     * Create a namespace channel
     */
    createChannel(channelId) {
        var namespaceChannel = this.service.of('/' + channelId);
        
        // events
        namespaceChannel.on('connection', function (socket) {
            console.log('new connection on channel: ' + channelId + ', socket id: ' + socket.id); // remove closure

            socket.on('disconnecting', function (reason) {
                console.log('socket disconnecting: ' + socket.id); // remove closure
            });

            socket.on('disconnect', function (reason) {
                console.log('socket disconnected: ' + socket.id); // remove closure
            });

            socket.on('message', (message) => {
                console.log('Received message ', from);

                if (this.messageCallback) {
                    this.messageCallback(channelId, message);
                }
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
     * Registers the specified callback once a message has been received on socket
     * callback parameters: channelid, message: WebSocketMessage
     */
    onMessage(messageCallback) {
        this.messageCallback = messageCallback;
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
        this.messageCallback = null;
    }

}

exports.Class = WebSocketService;