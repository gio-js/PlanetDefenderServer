
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
        const userId = request.params.userId;

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
        const webSocketInstance = request.app.get('webSocketInstance');
        webSocketInstance.createChannel(arena.Uid);

        // return
        return response.json(arena);
    }));

    /**
     * Join the specified arena
     */
    apiRoutes.get("/game/joinArena/:userId", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
      return new Promise((resolve, reject) => {
          const userId = request.params.userId;

          // get redis service
          const service = new PubSubService.Class();

          // dequeue empty arena
          const queue = new RQ.Channel();
          queue.attach(service.getNativeService());

          try {
            queue.popTimeout(ARENA_QUEUE_NAME, 1, uid => {
              console.log("found arena id:" + uid);

              service.get(uid).then(arena => {
                const arenaObject = JSON.parse(arena);
                console.log("found arena:" + arenaObject);
                console.log("arena.Uid:" + arenaObject.Uid);

                // create game arena
                const arenaInstance = PlanetDefenderCore.GameArenaFactory.Create(arenaObject);
                arenaInstance.RandomizeAttacker(userId);
                console.log("arenaInstance.Uid:" + arenaInstance.Uid);

                // take every channel listener informed about new joined player
                const webSocketInstance = request.app.get('webSocketInstance');
                webSocketInstance.sendMessage(arenaInstance.Uid, PlanetDefenderCore.WEBSOCKET_EVENT_NEW_PLAYER_JOINED, JSON.stringify(arenaInstance));

                response.json(arenaInstance);
                resolve(arenaInstance);
              })
            });

          } catch(ex) {

            console.error("pop arena error -------------------------");
            console.error(ex);
          }

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
        console.log(command);

        // manage command collisions
        let accepted = true;

        // send accepted or rejected by web socket
        const webSocketInstance = request.app.get('webSocketInstance');

        let message = PlanetDefenderCore.WEBSOCKET_COMMAND_ACCEPTED;
        if (accepted === false) {
          message = PlanetDefenderCore.WEBSOCKET_COMMAND_REJECTED;
        }
        webSocketInstance.sendMessage(command.ArenaUid, PlanetDefenderCore.WEBSOCKET_COMMAND_ACCEPTED, command);

    }));

    
  }
}

exports.Class = GameController;