// requires
const express = require('express');
const bodyParser = require('body-parser');
const serviceConst = require('./const/app.const.service');

// services
const app = express();
const router = express.Router(); 

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// controllers
const UsersController = require('./controllers/app.controller.user');
const AuthenticationController = require('./controllers/app.controller.auth');

app.listen(serviceConst.LISTENING_PORT, (err) => {
  if (err) {
    return console.log('Error starting server: ', err)
  }

  console.log(`Server listening on ${serviceConst.LISTENING_PORT}`)
})

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


app.use(serviceConst.BASE_URL_SERVICE, router);