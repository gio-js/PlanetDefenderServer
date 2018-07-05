
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const PlanetDefenderCore = require('planet-defender-core');
const BaseController = require("./base/app.controller.base");
const UserService = require('../services/business/app.service.user');
const SecurityService = require('../services/business/app.service.security');
const PubSubService = require('../services/core/app.service.pubSub');
const RQ = require('node-redis-queue');

const ARENA_QUEUE_NAME = "ArenaWaitingList";

class GameController {
  constructor() {}

  

  register(apiRoutes) {

    /**
     * Game arena, Create
     */
    apiRoutes.get("/game/createArena/:userId", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
        var userId = request.params.userId;

        // create game arena
        const arena = new PlanetDefenderCore.GameArena();
        arena.Randomize(userId);

        // store it to redis
        const service = new PubSubService.Class();
        service.store(arena.Uid, arena);

        // enqueue new empty arena
        const queue = new RQ.Channel();
        queue.attach(service.getNativeService());
        queue.push(ARENA_QUEUE_NAME, arena.Uid);

        // create the new channel for the game
        const webSocketInstance = req.app.get('webSocketInstance');
        ws.createChannel(arena.Uid);

        // return
        return response.json(arena);
    }));

    /**
     * Join the specified arena
     */
    apiRoutes.post("/game/joinArena", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
      return new Promise((resolve, reject) => {
          // get redis service
          const service = new PubSubService.Class();

          // dequeue empty arena
          const queue = new RQ.Channel();
          queue.attach(service.getNativeService());

          queue.popTimeout(ARENA_QUEUE_NAME, 1, uid => {
            service.get(arena.Uid, arena).then(arena => {

              // take every channel listener informed about new joined player
              const webSocketInstance = req.app.get('webSocketInstance');
              webSocketInstance.sendMessage(arena.Uid, PlanetDefenderCore.WEBSOCKET_EVENT_NEW_PLAYER_JOINED, arena);

              response.json(arena);
              resolve(arena);
            })
          });

          response.json(null);
          reject(null);

      });

    }));

    /**
     * Join the specified arena
     */
    apiRoutes.post("/game/userStatistics/:userId", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
      

    }));

    /**
     * Join the specified arena
     */
    apiRoutes.post("/game/notifyCommand", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
        let command = request.body.command;

        // manage command collisions
        let accepted = true;

        // send accepted or rejected by web socket
        const webSocketInstance = req.app.get('webSocketInstance');

        let message = PlanetDefenderCore.WEBSOCKET_COMMAND_ACCEPTED;
        if (accepted === false) {
          message = PlanetDefenderCore.WEBSOCKET_COMMAND_REJECTED;
        }
        webSocketInstance.sendMessage(arena.Uid, PlanetDefenderCore.WEBSOCKET_COMMAND_ACCEPTED, command);
        
    }));

    
  }
}

exports.Class = GameController;