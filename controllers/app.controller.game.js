
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const PlanetDefenderCore = require('planet-defender-core');
const BaseController = require("./base/app.controller.base");
const GameService = require('../services/business/app.service.game');
const PubSubService = require('../services/core/app.service.pubSub');
const RQ = require('node-redis-queue');
const UserStatisticsService = require('../services/business/app.service.userStatistics');
const app = express();

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

        // update server instance
        app.set('webSocketInstance', webSocketInstance);

        service.dispose();

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
          const webSocketInstance = request.app.get('webSocketInstance');

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
                webSocketInstance.sendMessage(arenaInstance.Uid, PlanetDefenderCore.WEBSOCKET_EVENT_NEW_PLAYER_JOINED, JSON.stringify(arenaInstance));

                service.dispose();

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
      const userId = request.params.userId;
      const service = new UserStatisticsService.Class();

      return service.getStatistics(userId).then(stats => {
        response.json(stats);

        service.dispose();

      });

    }));

    /**
     * Join the specified arena
     */
    apiRoutes.post("/game/notifyCommand", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {

      let command = request.body.command;
      // console.log(command);
      const gameService = new GameService.Class();
      const redisService = new PubSubService.Class();

      return redisService
        .get(command.ArenaUid)
        .then(arena => {
          const arenaObject = JSON.parse(arena);

          // create game arena
          const arenaInstance = PlanetDefenderCore.GameArenaFactory.Create(arenaObject);

          // manage command collisions
          let accepted = gameService.manageCommand(arenaInstance, command);

          // send accepted or rejected by web socket
          const webSocketInstance = request.app.get('webSocketInstance');
  
          let message = PlanetDefenderCore.WEBSOCKET_COMMAND_ACCEPTED;
          if (accepted === false) {
            message = PlanetDefenderCore.WEBSOCKET_COMMAND_REJECTED;
          }
          webSocketInstance.sendMessage(command.ArenaUid, PlanetDefenderCore.WEBSOCKET_COMMAND_ACCEPTED, command);

          // store updated game arena snapshot
          redisService.store(arenaInstance.Uid, arenaInstance);

          // clients dispose
          redisService.dispose();
          gameService.dispose();
  
          response.json(true);
        }).catch(err => {
          redisService.dispose();
          response.json(true);
        });

    }));


  }

}

exports.Class = GameController;