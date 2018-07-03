// requires
const express = require('express');
const bodyParser = require('body-parser');
const serviceConst = require('./const/app.const.service');
const webSocket = require('./services/core/app.service.webSocket');
const http = require('http');
const cors = require('cors')

// services
const app = express();
const router = express.Router(); 
const httpServer = http.Server(app);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// controllers
const UsersController = require('./controllers/app.controller.user');
const AuthenticationController = require('./controllers/app.controller.auth');
const GameController = require('./controllers/app.controller.game');

/**
 * Websocket
 */
const ws = new webSocket.Class(httpServer);
ws.createChannel('test');

/**
 * Base default
 */
app.get('/', function (req, res, next) {
  res.write('Planet defender server is on.');
});

/**
 * Register users routers
 */
const usersController = new UsersController.Class();
usersController.register(router);

/**
 * Register authentication routers
 */
const authController = new AuthenticationController.Class();
authController.register(router);

/**
 * Register game routers
 */
const gameController = new GameController.Class();
gameController.register(router);

app.use(cors());
app.use(serviceConst.BASE_URL_SERVICE, router);

httpServer.listen(serviceConst.LISTENING_PORT, function(){
  console.log('listening on *:' + serviceConst.LISTENING_PORT);
});