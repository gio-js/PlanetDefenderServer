
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const PlanetDefenderCore = require('planet-defender-core');
const BaseController = require("./base/app.controller.base");
const UserService = require('../services/business/app.service.user');
const SecurityService = require('../services/business/app.service.security');
const PubSubService = require('../services/core/app.service.pubSub');
const WebSocketService = require('../services/core/app.service.webSocket');

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

        // store it to redis
        const service = new PubSubService.Class();
        service.store(arena.Uid, arena);

        // return
        return response.json(arena);
    }));

    /**
     * Game arena, Gets the first available arena not owned by the specified user
     */
    apiRoutes.post("/game/searchArena/:userId", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
       
    }));

    /**
     * Join the specified arena
     */
    apiRoutes.post("/game/joinArena/:arenaId", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
       
    }));

    /**
     * Join the specified arena
     */
    apiRoutes.post("/game/notifyCommand", jsonParser, BaseController.Instance.processWithAuthentication((request, response, next) => {
        let command = request.body.command;
       
    }));

    
  }
}

exports.Class = GameController;